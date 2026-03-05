import { getFunctions, httpsCallable } from 'firebase/functions';
import { getFirestore, doc, getDoc, collection, query, where, getDocs, Timestamp, setDoc, deleteDoc } from 'firebase/firestore';
import { LeaderboardResponse } from '@/integrations/firebase/types';

/**
 * Calculate department leaderboard using Firebase Cloud Function
 * 
 * Requirements: 1.1, 1.4, 2.1, 2.2, 2.3, 6.1, 6.2, 6.5
 * 
 * @param departmentId - The department ID to calculate leaderboard for
 * @param forceRefresh - If true, bypass cache and recalculate (default: false)
 * @param limit - Number of entries per page (default: 50, max: 100)
 * @param offset - Starting position for pagination (default: 0)
 * @returns LeaderboardResponse with sorted student rankings
 * @throws Error if the function call fails
 */
export async function calculateDepartmentLeaderboard(
  departmentId: string,
  forceRefresh: boolean = false,
  limit: number = 50,
  offset: number = 0
): Promise<LeaderboardResponse> {
  if (!departmentId) {
    throw new Error('departmentId is required');
  }

  // Validate pagination parameters
  if (limit < 1 || limit > 100) {
    throw new Error('limit must be between 1 and 100');
  }

  if (offset < 0) {
    throw new Error('offset must be non-negative');
  }

  try {
    const functions = getFunctions();
    const callable = httpsCallable<
      { departmentId: string; forceRefresh?: boolean; limit?: number; offset?: number },
      LeaderboardResponse
    >(functions, 'calculateDepartmentLeaderboard');

    const result = await callable({ departmentId, forceRefresh, limit, offset });
    return result.data;
  } catch (error) {
    console.error('Error calculating department leaderboard:', error);
    throw new Error(
      `Failed to calculate leaderboard: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

/**
 * Get cached leaderboard data from Firestore
 * Requirements: 6.1, 6.2, 6.5
 * 
 * This function reads directly from the leaderboardCache collection
 * for faster loading without calling the Cloud Function
 * 
 * @param departmentId - The department ID to get cached data for
 * @param limit - Number of entries per page (default: 50)
 * @param offset - Starting position for pagination (default: 0)
 * @returns LeaderboardResponse if cache exists and is valid, null otherwise
 */
export async function getCachedLeaderboard(
  departmentId: string,
  limit: number = 50,
  offset: number = 0
): Promise<LeaderboardResponse | null> {
  if (!departmentId) {
    throw new Error('departmentId is required');
  }

  // Validate pagination parameters
  if (limit < 1 || limit > 100) {
    throw new Error('limit must be between 1 and 100');
  }

  if (offset < 0) {
    throw new Error('offset must be non-negative');
  }

  try {
    const db = getFirestore();
    const cacheRef = doc(db, 'leaderboardCache', departmentId);
    const cacheDoc = await getDoc(cacheRef);

    if (!cacheDoc.exists()) {
      return null;
    }

    const cacheData = cacheDoc.data();
    
    // Check if cache has expired
    const now = Date.now();
    const expiresAt = cacheData.expiresAt?.toMillis();
    
    if (!expiresAt || expiresAt < now) {
      return null;
    }

    // Apply pagination to cached entries
    const allEntries = cacheData.entries || [];
    const paginatedEntries = allEntries.slice(offset, offset + limit);
    const hasMore = offset + limit < allEntries.length;
    const nextCursor = hasMore ? offset + limit : undefined;

    // Return cached data in LeaderboardResponse format
    return {
      entries: paginatedEntries,
      totalStudents: cacheData.totalStudents || 0,
      lastUpdated: cacheData.lastUpdated,
      departmentId: cacheData.departmentId,
      hasMore,
      nextCursor
    };
  } catch (error) {
    console.error('Error reading cached leaderboard:', error);
    return null;
  }
}

/**
 * Get leaderboard with automatic cache fallback
 * Requirements: 6.1, 6.2, 6.5
 * 
 * This function first tries to read from cache, and if cache is invalid
 * or doesn't exist, it calls the Cloud Function to calculate fresh data
 * 
 * @param departmentId - The department ID to get leaderboard for
 * @param limit - Number of entries per page (default: 50)
 * @param offset - Starting position for pagination (default: 0)
 * @returns LeaderboardResponse with sorted student rankings
 */
export async function getLeaderboard(
  departmentId: string,
  limit: number = 50,
  offset: number = 0
): Promise<LeaderboardResponse> {
  // Try cache first
  const cachedData = await getCachedLeaderboard(departmentId, limit, offset);
  if (cachedData) {
    return cachedData;
  }

  // Fallback to calculating fresh data
  try {
    return await calculateDepartmentLeaderboard(departmentId, false, limit, offset);
  } catch (err) {
    console.warn('Cloud Function leaderboard failed, using client-side fallback:', err);
    return await calculateClientSideLeaderboard(departmentId, limit, offset);
  }
}

/**
 * Client-side fallback leaderboard calculation when Cloud Functions are unavailable.
 * Aggregates submitted exam attempts for students in the department.
 */
export async function calculateClientSideLeaderboard(
  departmentId: string,
  limit: number = 50,
  offset: number = 0
): Promise<LeaderboardResponse> {
  if (!departmentId) {
    throw new Error('departmentId is required');
  }
  const db = getFirestore();
  // Get all students in the department
  const usersQ = query(
    collection(db, 'users'),
    where('role', '==', 'student'),
    where('departmentId', '==', departmentId)
  );
  const usersSnap = await getDocs(usersQ);
  const students = usersSnap.docs.map(d => ({ id: d.id, data: d.data() as any }));
  const entries: Array<{
    studentId: string;
    studentName: string;
    totalScore: number;
    maxScore: number;
    examCount: number;
  }> = [];
  // For each student, aggregate submitted attempts
  for (const s of students) {
    const attemptsQ = query(
      collection(db, 'examAttempts'),
      where('studentId', '==', s.id),
      where('isSubmitted', '==', true)
    );
    const attemptsSnap = await getDocs(attemptsQ);
    let totalScore = 0;
    let maxScore = 0;
    let examCount = 0;
    attemptsSnap.forEach(docSnap => {
      const a = docSnap.data() as any;
      const ts = Number(a.totalScore) || 0;
      const ms = Number(a.maxScore) || 0;
      totalScore += ts;
      maxScore += ms;
      examCount += 1;
    });
    if (examCount > 0) {
      entries.push({
        studentId: s.id,
        studentName: s.data.fullName || s.data.email || 'Student',
        totalScore,
        maxScore,
        examCount
      });
    }
  }
  // Transform to LeaderboardEntry
  const leaderboardEntries = entries
    .map(e => ({
      studentId: e.studentId,
      studentName: e.studentName,
      departmentId,
      totalPoints: e.totalScore, // use totalScore as points
      averageScore: e.maxScore > 0 ? (e.totalScore / e.maxScore) * 100 : 0,
      examCount: e.examCount,
      rankPosition: 0 // filled after sort
    }))
    .sort((a, b) => {
      if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
      return b.averageScore - a.averageScore;
    })
    .map((entry, idx) => ({ ...entry, rankPosition: idx + 1 }));

  const totalStudents = leaderboardEntries.length;
  const paginated = leaderboardEntries.slice(offset, offset + limit);
  const hasMore = offset + limit < totalStudents;
  const nextCursor = hasMore ? offset + limit : undefined;
  return {
    entries: paginated,
    totalStudents,
    lastUpdated: Timestamp.now(),
    departmentId,
    hasMore,
    nextCursor
  } as any;
}

/**
 * Calculate global department leaderboard using Firebase Cloud Function
 * 
 * Requirements: 3.1, 3.2, 3.3
 * 
 * This function:
 * - Calculates department-level rankings (Req 3.1)
 * - Shows department name, total score, average score, and active students (Req 3.2)
 * - Calculates department average from all students' average scores (Req 3.3)
 * 
 * @returns DepartmentLeaderboardResponse with sorted department rankings
 * @throws Error if the function call fails
 */
export async function calculateGlobalDepartmentLeaderboard(): Promise<import('@/integrations/firebase/types').DepartmentLeaderboardResponse> {
  try {
    const functions = getFunctions();
    const callable = httpsCallable<
      Record<string, never>,
      import('@/integrations/firebase/types').DepartmentLeaderboardResponse
    >(functions, 'calculateGlobalDepartmentLeaderboard');

    const result = await callable({});
    return result.data;
  } catch (error) {
    console.error('Error calculating global department leaderboard:', error);
    throw new Error(
      `Failed to calculate global department leaderboard: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

/**
 * Admin function to manually refresh leaderboard cache
 * Requirements: 5.4, 6.2
 * 
 * @param departmentId - Optional department ID to refresh. If not provided, refreshes all departments
 * @returns Response with success status and details
 */
export async function adminRefreshLeaderboardCache(
  departmentId?: string
): Promise<{
  success: boolean;
  message: string;
  departmentId?: string;
  totalStudents?: number;
  refreshedCount?: number;
  totalDepartments?: number;
  results?: Array<{ departmentId: string; success: boolean; totalStudents?: number; error?: string }>;
  timestamp: any;
}> {
  try {
    const functions = getFunctions();
    const callable = httpsCallable(functions, 'adminRefreshLeaderboardCache');

    const result = await callable({ departmentId });
    return result.data as any;
  } catch (error) {
    const db = getFirestore();
    const results: Array<{ departmentId: string; success: boolean; totalStudents?: number; error?: string }> = [];
    const refreshOne = async (deptId: string) => {
      try {
        const resp = await calculateClientSideLeaderboard(deptId, 100, 0);
        const expiresAt = Timestamp.fromMillis(Date.now() + 6 * 60 * 60 * 1000);
        await setDoc(doc(db, 'leaderboardCache', deptId), {
          departmentId: deptId,
          entries: resp.entries,
          totalStudents: resp.totalStudents,
          lastUpdated: Timestamp.now(),
          expiresAt
        }, { merge: true });
        results.push({ departmentId: deptId, success: true, totalStudents: resp.totalStudents });
      } catch (e: any) {
        results.push({ departmentId: deptId, success: false, error: e?.message || String(e) });
      }
    };
    if (departmentId) {
      await refreshOne(departmentId);
      return {
        success: results[0]?.success ?? false,
        message: results[0]?.success ? 'Cache refreshed' : `Failed: ${results[0]?.error || 'unknown'}`,
        departmentId,
        totalStudents: results[0]?.totalStudents,
        refreshedCount: results[0]?.success ? 1 : 0,
        timestamp: Timestamp.now()
      } as any;
    } else {
      const deptsSnap = await getDocs(collection(db, 'departments'));
      const deptIds = deptsSnap.docs.map(d => d.id);
      for (const dId of deptIds) {
        await refreshOne(dId);
      }
      return {
        success: results.every(r => r.success),
        message: 'Cache refresh completed',
        refreshedCount: results.filter(r => r.success).length,
        totalDepartments: deptIds.length,
        results,
        timestamp: Timestamp.now()
      } as any;
    }
  }
}

/**
 * Admin function to recalculate all rankings
 * Requirements: 5.4, 6.2
 * 
 * Forces a complete recalculation of all leaderboard rankings
 * and updates the cache for all departments
 * 
 * @returns Response with success status and details
 */
export async function adminRecalculateRankings(): Promise<{
  success: boolean;
  message: string;
  recalculatedCount: number;
  totalDepartments: number;
  totalStudents: number;
  results: Array<{ 
    departmentId: string; 
    success: boolean; 
    totalStudents?: number; 
    entriesCount?: number;
    error?: string 
  }>;
  timestamp: any;
}> {
  try {
    const functions = getFunctions();
    const callable = httpsCallable(functions, 'adminRecalculateRankings');

    const result = await callable({});
    return result.data as any;
  } catch (error) {
    const db = getFirestore();
    const deptsSnap = await getDocs(collection(db, 'departments'));
    const deptIds = deptsSnap.docs.map(d => d.id);
    const results: Array<{ departmentId: string; success: boolean; totalStudents?: number; entriesCount?: number; error?: string }> = [];
    let totalStudents = 0;
    for (const dId of deptIds) {
      try {
        const resp = await calculateClientSideLeaderboard(dId, 100, 0);
        const expiresAt = Timestamp.fromMillis(Date.now() + 6 * 60 * 60 * 1000);
        await setDoc(doc(db, 'leaderboardCache', dId), {
          departmentId: dId,
          entries: resp.entries,
          totalStudents: resp.totalStudents,
          lastUpdated: Timestamp.now(),
          expiresAt
        }, { merge: true });
        totalStudents += resp.totalStudents;
        results.push({ departmentId: dId, success: true, totalStudents: resp.totalStudents, entriesCount: resp.entries.length });
      } catch (e: any) {
        results.push({ departmentId: dId, success: false, error: e?.message || String(e) });
      }
    }
    return {
      success: results.every(r => r.success),
      message: 'Recalculation completed',
      recalculatedCount: results.filter(r => r.success).length,
      totalDepartments: deptIds.length,
      totalStudents,
      results,
      timestamp: Timestamp.now()
    } as any;
  }
}

/**
 * Admin function to reset leaderboard for a department
 * Requirements: 5.4, 6.2
 * 
 * Clears the leaderboard cache for a specific department
 * 
 * @param departmentId - The department ID to reset
 * @returns Response with success status
 */
export async function adminResetLeaderboard(
  departmentId: string
): Promise<{
  success: boolean;
  message: string;
  departmentId: string;
  timestamp: any;
}> {
  if (!departmentId) {
    throw new Error('departmentId is required');
  }

  try {
    const functions = getFunctions();
    const callable = httpsCallable(functions, 'adminResetLeaderboard');

    const result = await callable({ departmentId });
    return result.data as any;
  } catch (error) {
    const db = getFirestore();
    await deleteDoc(doc(db, 'leaderboardCache', departmentId));
    return {
      success: true,
      message: 'Leaderboard cache cleared',
      departmentId,
      timestamp: Timestamp.now()
    } as any;
  }
}

/**
 * Admin function to get leaderboard system status
 * Requirements: 5.4, 6.2
 * 
 * Provides system-wide statistics about the leaderboard
 * including cache status, department counts, and student counts
 * 
 * @returns System status information
 */
export async function adminGetLeaderboardStatus(): Promise<{
  success: boolean;
  status: {
    totalDepartments: number;
    totalStudents: number;
    totalExamAttempts: number;
    cache: {
      total: number;
      valid: number;
      expired: number;
      totalCachedStudents: number;
    };
    cacheDetails: Array<{
      departmentId: string;
      totalStudents: number;
      lastUpdated: any;
      expiresAt: any;
      isExpired: boolean;
    }>;
  };
  timestamp: any;
}> {
  try {
    const functions = getFunctions();
    const callable = httpsCallable(functions, 'adminGetLeaderboardStatus');

    const result = await callable({});
    return result.data as any;
  } catch (error) {
    const db = getFirestore();
    const deptsSnap = await getDocs(collection(db, 'departments'));
    const deptIds = deptsSnap.docs.map(d => d.id);
    const studentsSnap = await getDocs(query(collection(db, 'users'), where('role', '==', 'student')));
    const attemptsSnap = await getDocs(collection(db, 'examAttempts'));
    const cacheDocs = await Promise.all(deptIds.map(dId => getDoc(doc(db, 'leaderboardCache', dId))));
    let totalCachedStudents = 0;
    let valid = 0;
    let expired = 0;
    const cacheDetails: Array<{ departmentId: string; totalStudents: number; lastUpdated: any; expiresAt: any; isExpired: boolean; }> = [];
    cacheDocs.forEach((snap, idx) => {
      if (snap.exists()) {
        const data = snap.data() as any;
        const expiresAtMillis = data.expiresAt?.toMillis?.() ?? 0;
        const isExpired = !expiresAtMillis || expiresAtMillis < Date.now();
        if (isExpired) expired++; else valid++;
        totalCachedStudents += (Array.isArray(data.entries) ? data.entries.length : 0);
        cacheDetails.push({
          departmentId: deptIds[idx],
          totalStudents: data.totalStudents || 0,
          lastUpdated: data.lastUpdated,
          expiresAt: data.expiresAt,
          isExpired
        });
      }
    });
    return {
      success: true,
      status: {
        totalDepartments: deptIds.length,
        totalStudents: studentsSnap.size,
        totalExamAttempts: attemptsSnap.size,
        cache: {
          total: cacheDocs.length,
          valid,
          expired,
          totalCachedStudents
        },
        cacheDetails
      },
      timestamp: Timestamp.now()
    } as any;
  }
}
