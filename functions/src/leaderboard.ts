import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import {
  LeaderboardEntry,
  LeaderboardResponse,
  ExamAttemptData,
  UserProfileData,
  StudentStats,
  LeaderboardCache,
  DepartmentRanking,
  DepartmentLeaderboardResponse,
  DepartmentData,
  DepartmentStats,
  SecurityLogEntry
} from './types';

const db = admin.firestore();

// Cache expiration time in milliseconds (10 minutes)
const CACHE_TTL_MS = 10 * 60 * 1000;

/**
 * Log security violations
 * Requirements: 5.5
 */
async function logSecurityViolation(
  userId: string,
  action: string,
  reason: string,
  requestedDepartmentId?: string,
  userDepartmentId?: string
): Promise<void> {
  try {
    const logEntry: SecurityLogEntry = {
      timestamp: admin.firestore.Timestamp.now(),
      userId,
      action,
      reason,
      requestedDepartmentId,
      userDepartmentId
    };

    await db.collection('securityLogs').add(logEntry);
    
    console.warn('Security violation logged:', {
      userId,
      action,
      reason,
      requestedDepartmentId,
      userDepartmentId
    });
  } catch (error) {
    console.error('Error logging security violation:', error);
    // Don't throw - logging failure shouldn't break the function
  }
}

/**
 * Verify user authentication and get user profile
 * Requirements: 5.1, 5.6
 */
async function verifyAuthAndGetProfile(
  context: functions.https.CallableContext
): Promise<UserProfileData> {
  // Check if user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated to access leaderboard data'
    );
  }

  const userId = context.auth.uid;

  // Get user profile
  const userDoc = await db.collection('userProfiles').doc(userId).get();

  if (!userDoc.exists) {
    throw new functions.https.HttpsError(
      'not-found',
      'User profile not found'
    );
  }

  const userData = userDoc.data() as UserProfileData;
  
  return {
    userId,
    fullName: userData.fullName,
    departmentId: userData.departmentId,
    role: userData.role
  };
}

/**
 * Verify department membership
 * Requirements: 5.1, 5.2, 5.6
 */
async function verifyDepartmentAccess(
  userProfile: UserProfileData,
  requestedDepartmentId: string
): Promise<boolean> {
  // Admins can access any department
  if (userProfile.role === 'admin' || userProfile.role === 'superadmin') {
    return true;
  }

  // Students can only access their own department
  if (userProfile.departmentId !== requestedDepartmentId) {
    await logSecurityViolation(
      userProfile.userId,
      'access_other_department_leaderboard',
      'Student attempted to access leaderboard from different department',
      requestedDepartmentId,
      userProfile.departmentId
    );
    return false;
  }

  return true;
}

/**
 * Read leaderboard data from cache
 * Requirements: 6.1, 6.2
 */
async function readFromCache(departmentId: string): Promise<LeaderboardCache | null> {
  try {
    const cacheDoc = await db
      .collection('leaderboardCache')
      .doc(departmentId)
      .get();

    if (!cacheDoc.exists) {
      return null;
    }

    const cacheData = cacheDoc.data() as LeaderboardCache;
    const now = admin.firestore.Timestamp.now();

    // Check if cache has expired
    if (cacheData.expiresAt.toMillis() < now.toMillis()) {
      return null;
    }

    return cacheData;
  } catch (error) {
    console.error('Error reading from cache:', error);
    return null;
  }
}

/**
 * Write leaderboard data to cache
 * Requirements: 6.1, 6.6
 */
async function writeToCache(
  departmentId: string,
  entries: LeaderboardEntry[],
  totalStudents: number
): Promise<void> {
  try {
    const now = admin.firestore.Timestamp.now();
    const expiresAt = admin.firestore.Timestamp.fromMillis(
      now.toMillis() + CACHE_TTL_MS
    );

    const cacheData: LeaderboardCache = {
      departmentId,
      entries,
      lastUpdated: now,
      expiresAt,
      totalStudents
    };

    await db
      .collection('leaderboardCache')
      .doc(departmentId)
      .set(cacheData);
  } catch (error) {
    console.error('Error writing to cache:', error);
    // Don't throw - cache write failure shouldn't break the function
  }
}

/**
 * Invalidate cache for a specific department
 * Requirements: 6.6
 */
async function invalidateCache(departmentId: string): Promise<void> {
  try {
    await db
      .collection('leaderboardCache')
      .doc(departmentId)
      .delete();
  } catch (error) {
    console.error('Error invalidating cache:', error);
  }
}

/**
 * Calculate leaderboard rankings (internal function)
 * This is the core calculation logic extracted for reuse
 */
async function calculateRankings(departmentId: string): Promise<{
  entries: LeaderboardEntry[];
  totalStudents: number;
}> {
  // Step 1: Get all students in the department
  const studentsSnapshot = await db
    .collection('userProfiles')
    .where('departmentId', '==', departmentId)
    .where('role', '==', 'student')
    .get();

  if (studentsSnapshot.empty) {
    return {
      entries: [],
      totalStudents: 0
    };
  }

  // Create a map of student profiles
  const studentProfiles = new Map<string, UserProfileData>();
  studentsSnapshot.forEach(doc => {
    const data = doc.data() as UserProfileData;
    studentProfiles.set(data.userId, data);
  });

  const studentIds = Array.from(studentProfiles.keys());

  // Step 2: Get all submitted exam attempts for these students
  // Using batched queries to avoid "in" query limitations (max 10 items)
  const batchSize = 10;
  const allAttempts: ExamAttemptData[] = [];

  for (let i = 0; i < studentIds.length; i += batchSize) {
    const batch = studentIds.slice(i, i + batchSize);
    const attemptsSnapshot = await db
      .collection('examAttempts')
      .where('studentId', 'in', batch)
      .where('isSubmitted', '==', true)
      .get();

    attemptsSnapshot.forEach(doc => {
      const data = doc.data() as ExamAttemptData;
      // Only include attempts with valid scores
      if (data.totalScore !== null && data.maxScore !== null && data.maxScore > 0) {
        allAttempts.push(data);
      }
    });
  }

  // Step 3: Calculate statistics for each student
  const studentStatsMap = new Map<string, StudentStats>();

  allAttempts.forEach(attempt => {
    const studentId = attempt.studentId;
    const profile = studentProfiles.get(studentId);
    
    if (!profile) return;

    if (!studentStatsMap.has(studentId)) {
      studentStatsMap.set(studentId, {
        studentId,
        studentName: profile.fullName,
        totalPoints: 0,
        averageScore: 0,
        examCount: 0
      });
    }

    const stats = studentStatsMap.get(studentId)!;
    stats.totalPoints += attempt.totalScore!;
    stats.examCount += 1;
  });

  // Calculate average scores
  studentStatsMap.forEach(stats => {
    if (stats.examCount > 0) {
      stats.averageScore = stats.totalPoints / stats.examCount;
    }
  });

  // Step 4: Sort students by total points (descending), then by average score
  const sortedStudents = Array.from(studentStatsMap.values()).sort((a, b) => {
    if (b.totalPoints !== a.totalPoints) {
      return b.totalPoints - a.totalPoints;
    }
    return b.averageScore - a.averageScore;
  });

  // Step 5: Assign rank positions
  const entries: LeaderboardEntry[] = sortedStudents.map((stats, index) => ({
    studentId: stats.studentId,
    studentName: stats.studentName,
    departmentId,
    totalPoints: Math.round(stats.totalPoints * 100) / 100, // Round to 2 decimals
    averageScore: Math.round(stats.averageScore * 100) / 100, // Round to 2 decimals
    examCount: stats.examCount,
    rankPosition: index + 1
  }));

  return {
    entries,
    totalStudents: entries.length
  };
}

/**
 * Calculate department leaderboard based on exam attempts
 * Requirements: 1.1, 1.4, 2.1, 2.2, 2.3, 5.1, 5.2, 5.3, 5.5, 5.6, 6.1, 6.2, 6.5
 * 
 * This function:
 * - Maintains department isolation (Req 1.1)
 * - Calculates total points from submitted ExamAttempts (Req 2.1)
 * - Calculates average scores (Req 2.2)
 * - Counts completed exams (Req 2.3)
 * - Only uses submitted attempts (Req 2.4)
 * - Uses cache to optimize performance (Req 6.1, 6.2)
 * - Enforces authentication (Req 5.1, 5.6)
 * - Validates department membership (Req 5.2, 5.6)
 * - Uses verified exam results only (Req 5.3)
 * - Logs security violations (Req 5.5)
 * - Supports pagination for large leaderboards (Req 6.5)
 */
export const calculateDepartmentLeaderboard = functions.https.onCall(
  async (data: { 
    departmentId: string; 
    forceRefresh?: boolean;
    limit?: number;
    offset?: number;
  }, context) => {
    try {
      // Requirement 5.1, 5.6: Verify user authentication and get profile
      const userProfile = await verifyAuthAndGetProfile(context);

      // Validate input
      if (!data.departmentId) {
        throw new functions.https.HttpsError(
          'invalid-argument',
          'departmentId is required'
        );
      }

      const { 
        departmentId, 
        forceRefresh = false,
        limit = 50, // Default page size
        offset = 0  // Default starting position
      } = data;

      // Validate pagination parameters
      if (limit < 1 || limit > 100) {
        throw new functions.https.HttpsError(
          'invalid-argument',
          'limit must be between 1 and 100'
        );
      }

      if (offset < 0) {
        throw new functions.https.HttpsError(
          'invalid-argument',
          'offset must be non-negative'
        );
      }

      // Requirement 5.2, 5.6: Verify department access
      const hasAccess = await verifyDepartmentAccess(userProfile, departmentId);
      
      if (!hasAccess) {
        throw new functions.https.HttpsError(
          'permission-denied',
          'You do not have permission to access this department\'s leaderboard'
        );
      }

      // Try to read from cache first (unless force refresh is requested)
      // For pagination, we always need the full cached data to slice correctly
      if (!forceRefresh) {
        const cachedData = await readFromCache(departmentId);
        if (cachedData) {
          // Apply pagination to cached data
          const paginatedEntries = cachedData.entries.slice(offset, offset + limit);
          const hasMore = offset + limit < cachedData.entries.length;
          const nextCursor = hasMore ? offset + limit : undefined;

          return {
            entries: paginatedEntries,
            totalStudents: cachedData.totalStudents,
            lastUpdated: cachedData.lastUpdated,
            departmentId,
            hasMore,
            nextCursor,
            fromCache: true
          } as LeaderboardResponse & { fromCache: boolean };
        }
      }

      // Calculate fresh rankings
      const { entries, totalStudents } = await calculateRankings(departmentId);

      // Write to cache for future requests (always cache full data)
      await writeToCache(departmentId, entries, totalStudents);

      // Apply pagination to fresh data
      const paginatedEntries = entries.slice(offset, offset + limit);
      const hasMore = offset + limit < entries.length;
      const nextCursor = hasMore ? offset + limit : undefined;

      const response: LeaderboardResponse = {
        entries: paginatedEntries,
        totalStudents,
        lastUpdated: admin.firestore.Timestamp.now(),
        departmentId,
        hasMore,
        nextCursor
      };

      return response;
    } catch (error) {
      console.error('Error calculating leaderboard:', error);
      
      if (error instanceof functions.https.HttpsError) {
        throw error;
      }
      
      throw new functions.https.HttpsError(
        'internal',
        'Failed to calculate leaderboard',
        { error: error instanceof Error ? error.message : String(error) }
      );
    }
  }
);

/**
 * Trigger function to invalidate cache when exam attempts are updated
 * Requirements: 1.4, 6.6
 * 
 * This function:
 * - Triggers on exam attempt updates (Req 1.4)
 * - Invalidates cache incrementally when new results are submitted (Req 6.6)
 */
export const onExamAttemptUpdate = functions.firestore
  .document('examAttempts/{attemptId}')
  .onWrite(async (change, context) => {
    try {
      // Only process if the attempt was just submitted
      const before = change.before.exists ? change.before.data() : null;
      const after = change.after.exists ? change.after.data() : null;

      // Check if this is a new submission (isSubmitted changed from false to true)
      const wasSubmitted = before?.isSubmitted === true;
      const isNowSubmitted = after?.isSubmitted === true;

      if (!isNowSubmitted || wasSubmitted) {
        // Not a new submission, skip cache invalidation
        return;
      }

      // Get the student's department
      const studentId = after.studentId;
      if (!studentId) {
        console.error('No studentId found in exam attempt');
        return;
      }

      const studentDoc = await db
        .collection('userProfiles')
        .doc(studentId)
        .get();

      if (!studentDoc.exists) {
        console.error('Student profile not found:', studentId);
        return;
      }

      const studentData = studentDoc.data() as UserProfileData;
      const departmentId = studentData.departmentId;

      if (!departmentId) {
        console.error('No departmentId found for student:', studentId);
        return;
      }

      // Invalidate the cache for this department
      await invalidateCache(departmentId);
      console.log('Cache invalidated for department:', departmentId);
    } catch (error) {
      console.error('Error in onExamAttemptUpdate trigger:', error);
      // Don't throw - trigger failures shouldn't break the exam submission
    }
  });

/**
 * Scheduled function to refresh stale caches
 * Requirements: 6.4
 * 
 * This function runs every hour to refresh expired caches
 * Note: Requires Firebase Blaze plan for scheduled functions
 */
export const refreshStaleCaches = functions.pubsub
  .schedule('every 1 hours')
  .onRun(async (context) => {
    try {
      const now = admin.firestore.Timestamp.now();
      
      // Find all expired cache entries
      const expiredCaches = await db
        .collection('leaderboardCache')
        .where('expiresAt', '<', now)
        .get();

      if (expiredCaches.empty) {
        console.log('No expired caches found');
        return;
      }

      console.log(`Found ${expiredCaches.size} expired caches to refresh`);

      // Refresh each expired cache
      const refreshPromises = expiredCaches.docs.map(async (doc) => {
        const cacheData = doc.data() as LeaderboardCache;
        const departmentId = cacheData.departmentId;

        try {
          // Recalculate rankings
          const { entries, totalStudents } = await calculateRankings(departmentId);
          
          // Write fresh data to cache
          await writeToCache(departmentId, entries, totalStudents);
          
          console.log(`Refreshed cache for department: ${departmentId}`);
        } catch (error) {
          console.error(`Error refreshing cache for department ${departmentId}:`, error);
        }
      });

      await Promise.all(refreshPromises);
      console.log('Cache refresh completed');
    } catch (error) {
      console.error('Error in refreshStaleCaches:', error);
    }
  });

/**
 * Calculate global department leaderboard
 * Requirements: 3.1, 3.2, 3.3, 5.1, 5.6
 * 
 * This function:
 * - Calculates department-level rankings (Req 3.1)
 * - Shows department name, total score, average score, and active students (Req 3.2)
 * - Calculates department average from all students' average scores (Req 3.3)
 * - Enforces authentication (Req 5.1, 5.6)
 */
export const calculateGlobalDepartmentLeaderboard = functions.https.onCall(
  async (data, context) => {
    try {
      // Requirement 5.1, 5.6: Verify user authentication
      await verifyAuthAndGetProfile(context);

      // Step 1: Get all departments
      const departmentsSnapshot = await db
        .collection('departments')
        .get();

      if (departmentsSnapshot.empty) {
        return {
          rankings: [],
          totalDepartments: 0,
          lastUpdated: admin.firestore.Timestamp.now()
        } as DepartmentLeaderboardResponse;
      }

      // Create a map of departments
      const departmentsMap = new Map<string, DepartmentData>();
      departmentsSnapshot.forEach(doc => {
        const data = doc.data() as DepartmentData;
        departmentsMap.set(doc.id, {
          id: doc.id,
          name: data.name,
          createdAt: data.createdAt
        });
      });

      // Step 2: Get all students grouped by department
      const studentsSnapshot = await db
        .collection('userProfiles')
        .where('role', '==', 'student')
        .get();

      if (studentsSnapshot.empty) {
        return {
          rankings: [],
          totalDepartments: 0,
          lastUpdated: admin.firestore.Timestamp.now()
        } as DepartmentLeaderboardResponse;
      }

      // Group students by department
      const studentsByDepartment = new Map<string, string[]>();
      studentsSnapshot.forEach(doc => {
        const data = doc.data() as UserProfileData;
        if (data.departmentId) {
          if (!studentsByDepartment.has(data.departmentId)) {
            studentsByDepartment.set(data.departmentId, []);
          }
          studentsByDepartment.get(data.departmentId)!.push(data.userId);
        }
      });

      // Step 3: Calculate statistics for each department
      const departmentStatsMap = new Map<string, DepartmentStats>();

      for (const [departmentId, studentIds] of Array.from(studentsByDepartment.entries())) {
        const department = departmentsMap.get(departmentId);
        if (!department) continue;

        // Get all submitted exam attempts for students in this department
        // Using batched queries to avoid "in" query limitations (max 10 items)
        const batchSize = 10;
        const allAttempts: ExamAttemptData[] = [];

        for (let i = 0; i < studentIds.length; i += batchSize) {
          const batch = studentIds.slice(i, i + batchSize);
          const attemptsSnapshot = await db
            .collection('examAttempts')
            .where('studentId', 'in', batch)
            .where('isSubmitted', '==', true)
            .get();

          attemptsSnapshot.forEach(doc => {
            const data = doc.data() as ExamAttemptData;
            // Only include attempts with valid scores
            if (data.totalScore !== null && data.maxScore !== null && data.maxScore > 0) {
              allAttempts.push(data);
            }
          });
        }

        // Calculate per-student statistics
        const studentStatsMap = new Map<string, { totalPoints: number; examCount: number }>();

        allAttempts.forEach(attempt => {
          const studentId = attempt.studentId;
          if (!studentStatsMap.has(studentId)) {
            studentStatsMap.set(studentId, {
              totalPoints: 0,
              examCount: 0
            });
          }

          const stats = studentStatsMap.get(studentId)!;
          stats.totalPoints += attempt.totalScore!;
          stats.examCount += 1;
        });

        // Calculate department-level statistics
        // Requirement 3.3: Calculate department average from all students' average scores
        let totalDepartmentScore = 0;
        let totalStudentAverages = 0;
        let activeStudentCount = 0;

        studentStatsMap.forEach(stats => {
          if (stats.examCount > 0) {
            const studentAverage = stats.totalPoints / stats.examCount;
            totalDepartmentScore += stats.totalPoints;
            totalStudentAverages += studentAverage;
            activeStudentCount += 1;
          }
        });

        // Only include departments with active students
        if (activeStudentCount > 0) {
          departmentStatsMap.set(departmentId, {
            departmentId,
            departmentName: department.name,
            totalDepartmentScore,
            totalStudentAverages,
            activeStudentCount
          });
        }
      }

      // Step 4: Calculate average scores and sort departments
      const departmentStats = Array.from(departmentStatsMap.values()).map(stats => ({
        ...stats,
        averageScore: stats.totalStudentAverages / stats.activeStudentCount
      }));

      // Sort by average score (descending), then by total score
      departmentStats.sort((a, b) => {
        if (b.averageScore !== a.averageScore) {
          return b.averageScore - a.averageScore;
        }
        return b.totalDepartmentScore - a.totalDepartmentScore;
      });

      // Step 5: Assign rank positions and format response
      const rankings: DepartmentRanking[] = departmentStats.map((stats, index) => ({
        departmentId: stats.departmentId,
        departmentName: stats.departmentName,
        totalDepartmentScore: Math.round(stats.totalDepartmentScore * 100) / 100,
        averageScore: Math.round(stats.averageScore * 100) / 100,
        activeStudentCount: stats.activeStudentCount,
        rankPosition: index + 1
      }));

      const response: DepartmentLeaderboardResponse = {
        rankings,
        totalDepartments: rankings.length,
        lastUpdated: admin.firestore.Timestamp.now()
      };

      return response;
    } catch (error) {
      console.error('Error calculating department leaderboard:', error);
      
      if (error instanceof functions.https.HttpsError) {
        throw error;
      }
      
      throw new functions.https.HttpsError(
        'internal',
        'Failed to calculate department leaderboard',
        { error: error instanceof Error ? error.message : String(error) }
      );
    }
  }
);

/**
 * Admin function to manually refresh leaderboard cache
 * Requirements: 5.4, 6.2
 *
 * This function allows admins to manually trigger cache refresh
 * for a specific department or all departments
 */
export const adminRefreshLeaderboardCache = functions.https.onCall(
  async (data: { departmentId?: string }, context) => {
    try {
      // Verify user authentication and get profile
      const userProfile = await verifyAuthAndGetProfile(context);

      // Only admins can refresh cache
      if (userProfile.role !== 'admin' && userProfile.role !== 'superadmin') {
        throw new functions.https.HttpsError(
          'permission-denied',
          'Only administrators can refresh leaderboard cache'
        );
      }

      const { departmentId } = data;

      if (departmentId) {
        // Refresh cache for specific department
        const { entries, totalStudents } = await calculateRankings(departmentId);
        await writeToCache(departmentId, entries, totalStudents);

        return {
          success: true,
          message: `Cache refreshed for department: ${departmentId}`,
          departmentId,
          totalStudents,
          timestamp: admin.firestore.Timestamp.now()
        };
      } else {
        // Refresh cache for all departments
        const departmentsSnapshot = await db.collection('departments').get();

        if (departmentsSnapshot.empty) {
          return {
            success: true,
            message: 'No departments found',
            refreshedCount: 0,
            timestamp: admin.firestore.Timestamp.now()
          };
        }

        const refreshPromises = departmentsSnapshot.docs.map(async (doc) => {
          const deptId = doc.id;
          try {
            const { entries, totalStudents } = await calculateRankings(deptId);
            await writeToCache(deptId, entries, totalStudents);
            return { departmentId: deptId, success: true, totalStudents };
          } catch (error) {
            console.error(`Error refreshing cache for department ${deptId}:`, error);
            return { departmentId: deptId, success: false, error: String(error) };
          }
        });

        const results = await Promise.all(refreshPromises);
        const successCount = results.filter(r => r.success).length;

        return {
          success: true,
          message: `Cache refreshed for ${successCount} of ${results.length} departments`,
          refreshedCount: successCount,
          totalDepartments: results.length,
          results,
          timestamp: admin.firestore.Timestamp.now()
        };
      }
    } catch (error) {
      console.error('Error refreshing leaderboard cache:', error);

      if (error instanceof functions.https.HttpsError) {
        throw error;
      }

      throw new functions.https.HttpsError(
        'internal',
        'Failed to refresh leaderboard cache',
        { error: error instanceof Error ? error.message : String(error) }
      );
    }
  }
);

/**
 * Admin function to recalculate all rankings
 * Requirements: 5.4, 6.2
 *
 * This function forces a complete recalculation of all leaderboard rankings
 * and updates the cache for all departments
 */
export const adminRecalculateRankings = functions.https.onCall(
  async (data, context) => {
    try {
      // Verify user authentication and get profile
      const userProfile = await verifyAuthAndGetProfile(context);

      // Only admins can recalculate rankings
      if (userProfile.role !== 'admin' && userProfile.role !== 'superadmin') {
        throw new functions.https.HttpsError(
          'permission-denied',
          'Only administrators can recalculate rankings'
        );
      }

      // Get all departments
      const departmentsSnapshot = await db.collection('departments').get();

      if (departmentsSnapshot.empty) {
        return {
          success: true,
          message: 'No departments found',
          recalculatedCount: 0,
          timestamp: admin.firestore.Timestamp.now()
        };
      }

      // Recalculate rankings for all departments
      const recalculatePromises = departmentsSnapshot.docs.map(async (doc) => {
        const deptId = doc.id;
        try {
          // Invalidate existing cache first
          await invalidateCache(deptId);

          // Calculate fresh rankings
          const { entries, totalStudents } = await calculateRankings(deptId);

          // Write to cache
          await writeToCache(deptId, entries, totalStudents);

          return {
            departmentId: deptId,
            success: true,
            totalStudents,
            entriesCount: entries.length
          };
        } catch (error) {
          console.error(`Error recalculating rankings for department ${deptId}:`, error);
          return {
            departmentId: deptId,
            success: false,
            error: String(error)
          };
        }
      });

      const results = await Promise.all(recalculatePromises);
      const successCount = results.filter(r => r.success).length;
      const totalStudents = results
        .filter(r => r.success)
        .reduce((sum, r) => sum + (r.totalStudents || 0), 0);

      return {
        success: true,
        message: `Rankings recalculated for ${successCount} of ${results.length} departments`,
        recalculatedCount: successCount,
        totalDepartments: results.length,
        totalStudents,
        results,
        timestamp: admin.firestore.Timestamp.now()
      };
    } catch (error) {
      console.error('Error recalculating rankings:', error);

      if (error instanceof functions.https.HttpsError) {
        throw error;
      }

      throw new functions.https.HttpsError(
        'internal',
        'Failed to recalculate rankings',
        { error: error instanceof Error ? error.message : String(error) }
      );
    }
  }
);

/**
 * Admin function to reset leaderboard for a department
 * Requirements: 5.4, 6.2
 *
 * This function clears the leaderboard cache for a specific department
 * Used for maintenance or when data needs to be reset
 */
export const adminResetLeaderboard = functions.https.onCall(
  async (data: { departmentId: string }, context) => {
    try {
      // Verify user authentication and get profile
      const userProfile = await verifyAuthAndGetProfile(context);

      // Only admins can reset leaderboard
      if (userProfile.role !== 'admin' && userProfile.role !== 'superadmin') {
        throw new functions.https.HttpsError(
          'permission-denied',
          'Only administrators can reset leaderboard'
        );
      }

      const { departmentId } = data;

      if (!departmentId) {
        throw new functions.https.HttpsError(
          'invalid-argument',
          'departmentId is required'
        );
      }

      // Invalidate cache for the department
      await invalidateCache(departmentId);

      return {
        success: true,
        message: `Leaderboard cache cleared for department: ${departmentId}`,
        departmentId,
        timestamp: admin.firestore.Timestamp.now()
      };
    } catch (error) {
      console.error('Error resetting leaderboard:', error);

      if (error instanceof functions.https.HttpsError) {
        throw error;
      }

      throw new functions.https.HttpsError(
        'internal',
        'Failed to reset leaderboard',
        { error: error instanceof Error ? error.message : String(error) }
      );
    }
  }
);

/**
 * Admin function to get leaderboard system status
 * Requirements: 5.4, 6.2
 *
 * This function provides system-wide statistics about the leaderboard
 * including cache status, department counts, and student counts
 */
export const adminGetLeaderboardStatus = functions.https.onCall(
  async (data, context) => {
    try {
      // Verify user authentication and get profile
      const userProfile = await verifyAuthAndGetProfile(context);

      // Only admins can view system status
      if (userProfile.role !== 'admin' && userProfile.role !== 'superadmin') {
        throw new functions.https.HttpsError(
          'permission-denied',
          'Only administrators can view leaderboard status'
        );
      }

      // Get all departments
      const departmentsSnapshot = await db.collection('departments').get();
      const totalDepartments = departmentsSnapshot.size;

      // Get all cached leaderboards
      const cacheSnapshot = await db.collection('leaderboardCache').get();
      const now = admin.firestore.Timestamp.now();

      let validCaches = 0;
      let expiredCaches = 0;
      let totalCachedStudents = 0;

      const cacheDetails = cacheSnapshot.docs.map(doc => {
        const data = doc.data() as LeaderboardCache;
        const isExpired = data.expiresAt.toMillis() < now.toMillis();

        if (isExpired) {
          expiredCaches++;
        } else {
          validCaches++;
          totalCachedStudents += data.totalStudents || 0;
        }

        return {
          departmentId: data.departmentId,
          totalStudents: data.totalStudents,
          lastUpdated: data.lastUpdated,
          expiresAt: data.expiresAt,
          isExpired
        };
      });

      // Get total student count
      const studentsSnapshot = await db
        .collection('userProfiles')
        .where('role', '==', 'student')
        .get();
      const totalStudents = studentsSnapshot.size;

      // Get total exam attempts
      const attemptsSnapshot = await db
        .collection('examAttempts')
        .where('isSubmitted', '==', true)
        .get();
      const totalExamAttempts = attemptsSnapshot.size;

      return {
        success: true,
        status: {
          totalDepartments,
          totalStudents,
          totalExamAttempts,
          cache: {
            total: cacheSnapshot.size,
            valid: validCaches,
            expired: expiredCaches,
            totalCachedStudents
          },
          cacheDetails
        },
        timestamp: admin.firestore.Timestamp.now()
      };
    } catch (error) {
      console.error('Error getting leaderboard status:', error);

      if (error instanceof functions.https.HttpsError) {
        throw error;
      }

      throw new functions.https.HttpsError(
        'internal',
        'Failed to get leaderboard status',
        { error: error instanceof Error ? error.message : String(error) }
      );
    }
  }
);


/**
 * Admin function to manually refresh leaderboard cache
 * Requirements: 5.4, 6.2
 * 
 * This function allows admins to manually trigger cache refresh
 * for a specific department or all departments
 */
export const adminRefreshLeaderboardCache = functions.https.onCall(
  async (data: { departmentId?: string }, context) => {
    try {
      // Verify user authentication and get profile
      const userProfile = await verifyAuthAndGetProfile(context);

      // Only admins can refresh cache
      if (userProfile.role !== 'admin' && userProfile.role !== 'superadmin') {
        throw new functions.https.HttpsError(
          'permission-denied',
          'Only administrators can refresh leaderboard cache'
        );
      }

      const { departmentId } = data;

      if (departmentId) {
        // Refresh cache for specific department
        const { entries, totalStudents } = await calculateRankings(departmentId);
        await writeToCache(departmentId, entries, totalStudents);

        return {
          success: true,
          message: `Cache refreshed for department: ${departmentId}`,
          departmentId,
          totalStudents,
          timestamp: admin.firestore.Timestamp.now()
        };
      } else {
        // Refresh cache for all departments
        const departmentsSnapshot = await db.collection('departments').get();
        
        if (departmentsSnapshot.empty) {
          return {
            success: true,
            message: 'No departments found',
            refreshedCount: 0,
            timestamp: admin.firestore.Timestamp.now()
          };
        }

        const refreshPromises = departmentsSnapshot.docs.map(async (doc) => {
          const deptId = doc.id;
          try {
            const { entries, totalStudents } = await calculateRankings(deptId);
            await writeToCache(deptId, entries, totalStudents);
            return { departmentId: deptId, success: true, totalStudents };
          } catch (error) {
            console.error(`Error refreshing cache for department ${deptId}:`, error);
            return { departmentId: deptId, success: false, error: String(error) };
          }
        });

        const results = await Promise.all(refreshPromises);
        const successCount = results.filter(r => r.success).length;

        return {
          success: true,
          message: `Cache refreshed for ${successCount} of ${results.length} departments`,
          refreshedCount: successCount,
          totalDepartments: results.length,
          results,
          timestamp: admin.firestore.Timestamp.now()
        };
      }
    } catch (error) {
      console.error('Error refreshing leaderboard cache:', error);
      
      if (error instanceof functions.https.HttpsError) {
        throw error;
      }
      
      throw new functions.https.HttpsError(
        'internal',
        'Failed to refresh leaderboard cache',
        { error: error instanceof Error ? error.message : String(error) }
      );
    }
  }
);

/**
 * Admin function to recalculate all rankings
 * Requirements: 5.4, 6.2
 * 
 * This function forces a complete recalculation of all leaderboard rankings
 * and updates the cache for all departments
 */
export const adminRecalculateRankings = functions.https.onCall(
  async (data, context) => {
    try {
      // Verify user authentication and get profile
      const userProfile = await verifyAuthAndGetProfile(context);

      // Only admins can recalculate rankings
      if (userProfile.role !== 'admin' && userProfile.role !== 'superadmin') {
        throw new functions.https.HttpsError(
          'permission-denied',
          'Only administrators can recalculate rankings'
        );
      }

      // Get all departments
      const departmentsSnapshot = await db.collection('departments').get();
      
      if (departmentsSnapshot.empty) {
        return {
          success: true,
          message: 'No departments found',
          recalculatedCount: 0,
          timestamp: admin.firestore.Timestamp.now()
        };
      }

      // Recalculate rankings for all departments
      const recalculatePromises = departmentsSnapshot.docs.map(async (doc) => {
        const deptId = doc.id;
        try {
          // Invalidate existing cache first
          await invalidateCache(deptId);
          
          // Calculate fresh rankings
          const { entries, totalStudents } = await calculateRankings(deptId);
          
          // Write to cache
          await writeToCache(deptId, entries, totalStudents);
          
          return { 
            departmentId: deptId, 
            success: true, 
            totalStudents,
            entriesCount: entries.length 
          };
        } catch (error) {
          console.error(`Error recalculating rankings for department ${deptId}:`, error);
          return { 
            departmentId: deptId, 
            success: false, 
            error: String(error) 
          };
        }
      });

      const results = await Promise.all(recalculatePromises);
      const successCount = results.filter(r => r.success).length;
      const totalStudents = results
        .filter(r => r.success)
        .reduce((sum, r) => sum + (r.totalStudents || 0), 0);

      return {
        success: true,
        message: `Rankings recalculated for ${successCount} of ${results.length} departments`,
        recalculatedCount: successCount,
        totalDepartments: results.length,
        totalStudents,
        results,
        timestamp: admin.firestore.Timestamp.now()
      };
    } catch (error) {
      console.error('Error recalculating rankings:', error);
      
      if (error instanceof functions.https.HttpsError) {
        throw error;
      }
      
      throw new functions.https.HttpsError(
        'internal',
        'Failed to recalculate rankings',
        { error: error instanceof Error ? error.message : String(error) }
      );
    }
  }
);

/**
 * Admin function to reset leaderboard for a department
 * Requirements: 5.4, 6.2
 * 
 * This function clears the leaderboard cache for a specific department
 * Used for maintenance or when data needs to be reset
 */
export const adminResetLeaderboard = functions.https.onCall(
  async (data: { departmentId: string }, context) => {
    try {
      // Verify user authentication and get profile
      const userProfile = await verifyAuthAndGetProfile(context);

      // Only admins can reset leaderboard
      if (userProfile.role !== 'admin' && userProfile.role !== 'superadmin') {
        throw new functions.https.HttpsError(
          'permission-denied',
          'Only administrators can reset leaderboard'
        );
      }

      const { departmentId } = data;

      if (!departmentId) {
        throw new functions.https.HttpsError(
          'invalid-argument',
          'departmentId is required'
        );
      }

      // Invalidate cache for the department
      await invalidateCache(departmentId);

      return {
        success: true,
        message: `Leaderboard cache cleared for department: ${departmentId}`,
        departmentId,
        timestamp: admin.firestore.Timestamp.now()
      };
    } catch (error) {
      console.error('Error resetting leaderboard:', error);
      
      if (error instanceof functions.https.HttpsError) {
        throw error;
      }
      
      throw new functions.https.HttpsError(
        'internal',
        'Failed to reset leaderboard',
        { error: error instanceof Error ? error.message : String(error) }
      );
    }
  }
);

/**
 * Admin function to get leaderboard system status
 * Requirements: 5.4, 6.2
 * 
 * This function provides system-wide statistics about the leaderboard
 * including cache status, department counts, and student counts
 */
export const adminGetLeaderboardStatus = functions.https.onCall(
  async (data, context) => {
    try {
      // Verify user authentication and get profile
      const userProfile = await verifyAuthAndGetProfile(context);

      // Only admins can view system status
      if (userProfile.role !== 'admin' && userProfile.role !== 'superadmin') {
        throw new functions.https.HttpsError(
          'permission-denied',
          'Only administrators can view leaderboard status'
        );
      }

      // Get all departments
      const departmentsSnapshot = await db.collection('departments').get();
      const totalDepartments = departmentsSnapshot.size;

      // Get all cached leaderboards
      const cacheSnapshot = await db.collection('leaderboardCache').get();
      const now = admin.firestore.Timestamp.now();

      let validCaches = 0;
      let expiredCaches = 0;
      let totalCachedStudents = 0;

      const cacheDetails = cacheSnapshot.docs.map(doc => {
        const data = doc.data() as LeaderboardCache;
        const isExpired = data.expiresAt.toMillis() < now.toMillis();
        
        if (isExpired) {
          expiredCaches++;
        } else {
          validCaches++;
          totalCachedStudents += data.totalStudents || 0;
        }

        return {
          departmentId: data.departmentId,
          totalStudents: data.totalStudents,
          lastUpdated: data.lastUpdated,
          expiresAt: data.expiresAt,
          isExpired
        };
      });

      // Get total student count
      const studentsSnapshot = await db
        .collection('userProfiles')
        .where('role', '==', 'student')
        .get();
      const totalStudents = studentsSnapshot.size;

      // Get total exam attempts
      const attemptsSnapshot = await db
        .collection('examAttempts')
        .where('isSubmitted', '==', true)
        .get();
      const totalExamAttempts = attemptsSnapshot.size;

      return {
        success: true,
        status: {
          totalDepartments,
          totalStudents,
          totalExamAttempts,
          cache: {
            total: cacheSnapshot.size,
            valid: validCaches,
            expired: expiredCaches,
            totalCachedStudents
          },
          cacheDetails
        },
        timestamp: admin.firestore.Timestamp.now()
      };
    } catch (error) {
      console.error('Error getting leaderboard status:', error);
      
      if (error instanceof functions.https.HttpsError) {
        throw error;
      }
      
      throw new functions.https.HttpsError(
        'internal',
        'Failed to get leaderboard status',
        { error: error instanceof Error ? error.message : String(error) }
      );
    }
  }
);
