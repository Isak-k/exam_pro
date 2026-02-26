import { getFirestore, collection, query, where, orderBy, limit, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';

// Simple leaderboard entry type (different from the complex one in types.ts)
export interface LeaderboardEntry {
  studentId: string;
  displayName: string;
  email: string;
  departmentId: string;
  bestScore: number;
  averageScore: number;
  totalAttempts: number;
  rankPosition: number;
  lastExamDate: Date;
  improvementTrend: number;
}

/**
 * Simple client-side leaderboard calculation
 * This bypasses Cloud Functions and works directly with Firestore
 */
export async function getSimpleLeaderboard(departmentId?: string): Promise<LeaderboardEntry[]> {
  try {
    const db = getFirestore();
    
    console.log('🔍 Fetching leaderboard data...', { departmentId });

    // First try: read cached leaderboard written by Cloud Functions/Admin fallback
    if (departmentId) {
      const cacheRef = doc(db, 'leaderboardCache', departmentId);
      const cacheSnap = await getDoc(cacheRef);
      if (cacheSnap.exists()) {
        const data = cacheSnap.data() as any;
        const entriesFromCache = Array.isArray(data.entries) ? data.entries : [];
        const mapped: LeaderboardEntry[] = entriesFromCache.map((e: any) => ({
          studentId: e.studentId,
          displayName: e.studentName || e.displayName || e.email || 'Unknown',
          email: e.email || '',
          departmentId: departmentId,
          bestScore: Math.round((Number(e.averageScore) || 0) * 100) / 100,
          averageScore: Math.round((Number(e.averageScore) || 0) * 100) / 100,
          totalAttempts: Number(e.examCount) || 0,
          rankPosition: 0, // Will be recalculated
          lastExamDate: new Date(),
          improvementTrend: 0
        }))
        .sort((a, b) => b.bestScore - a.bestScore) // Re-sort to ensure correct rankings
        .map((entry, index) => ({ ...entry, rankPosition: index + 1 })); // Recalculate positions
        
        if (mapped.length > 0) {
          console.log('🏆 Using cached leaderboard entries (re-sorted):', mapped.length);
          return mapped;
        }
      } else {
        console.log('⚠️ No cached leaderboard found for department', departmentId);
        console.log('📊 Will calculate fresh data from exam attempts...');
      }
    }

    // Always calculate from attempts when cache is missing
    console.log('🔄 Calculating leaderboard from exam attempts...');

    // Get all exam attempts (no filtering to avoid permission issues)
    const attemptsQuery = query(
      collection(db, 'examAttempts'),
      limit(500)
    );

    console.log('📡 Executing query...');
    const attemptsSnapshot = await getDocs(attemptsQuery);
    
    console.log('✅ Query successful! Total attempts found:', attemptsSnapshot.size);
    
    // Log first few attempts to see the data structure
    if (attemptsSnapshot.size > 0) {
      attemptsSnapshot.docs.slice(0, 3).forEach(doc => {
        console.log('Sample attempt:', doc.id, doc.data());
      });
    } else {
      console.log('⚠️ No exam attempts found in database');
    }
    
    // Group by student and get their best scores
    const studentBestScores = new Map<string, {
      studentId: string;
      bestScore: number;
      totalAttempts: number;
      averageScore: number;
      scores: number[];
    }>();

    attemptsSnapshot.docs.forEach(doc => {
      const attempt = doc.data();
      
      // Skip if not submitted
      if (!attempt.isSubmitted) {
        console.log('⏭️ Skipping unsubmitted attempt:', doc.id);
        return;
      }
      
      // Check for score data
      if (attempt.totalScore === null || attempt.totalScore === undefined) {
        console.log('⚠️ Attempt missing totalScore:', doc.id, attempt);
        return;
      }
      
      if (attempt.maxScore === null || attempt.maxScore === undefined || attempt.maxScore === 0) {
        console.log('⚠️ Attempt missing/invalid maxScore:', doc.id, attempt);
        return;
      }
      
      const studentId = attempt.studentId;
      // Calculate percentage score
      const score = Math.round((attempt.totalScore / attempt.maxScore) * 100);
      
      console.log('✅ Valid attempt found:', {
        attemptId: doc.id,
        studentId,
        totalScore: attempt.totalScore,
        maxScore: attempt.maxScore,
        percentage: score
      });

      if (!studentBestScores.has(studentId)) {
        studentBestScores.set(studentId, {
          studentId,
          bestScore: score,
          totalAttempts: 1,
          averageScore: score,
          scores: [score]
        });
      } else {
        const existing = studentBestScores.get(studentId)!;
        existing.bestScore = Math.max(existing.bestScore, score);
        existing.totalAttempts += 1;
        existing.scores.push(score);
        existing.averageScore = existing.scores.reduce((a, b) => a + b, 0) / existing.scores.length;
      }
    });

    console.log('👥 Students with scores:', studentBestScores.size);

    // Get user profiles for names
    console.log('👤 Fetching user profiles...');
    const userProfiles = new Map<string, any>();
    const usersSnapshot = await getDocs(collection(db, 'users'));
    
    console.log('✅ Users found:', usersSnapshot.size);
    
    usersSnapshot.docs.forEach(doc => {
      userProfiles.set(doc.id, doc.data());
    });

    // Convert to leaderboard entries
    const entries: LeaderboardEntry[] = Array.from(studentBestScores.values())
      .filter(student => {
        const userProfile = userProfiles.get(student.studentId);
        
        console.log('🔍 Checking student:', {
          studentId: student.studentId,
          hasProfile: !!userProfile,
          profileDepartmentId: userProfile?.departmentId,
          filterDepartmentId: departmentId,
          matches: departmentId ? userProfile?.departmentId === departmentId : true
        });
        
        // Filter by department if specified
        if (departmentId && userProfile?.departmentId !== departmentId) {
          console.log('❌ Filtered out - department mismatch');
          return false;
        }
        
        if (!userProfile) {
          console.log('❌ Filtered out - no user profile');
          return false;
        }
        
        console.log('✅ Student included in leaderboard');
        return true;
      })
      .map((student) => {
        const userProfile = userProfiles.get(student.studentId);
        return {
          studentId: student.studentId,
          displayName: userProfile?.fullName || userProfile?.email || 'Unknown',
          email: userProfile?.email || '',
          departmentId: userProfile?.departmentId || '',
          bestScore: student.bestScore,
          averageScore: Math.round(student.averageScore * 100) / 100,
          totalAttempts: student.totalAttempts,
          rankPosition: 0, // Will be set after sorting
          lastExamDate: new Date(),
          improvementTrend: 0
        };
      })
      .sort((a, b) => b.bestScore - a.bestScore)
      .map((entry, index) => ({ ...entry, rankPosition: index + 1 }));

    console.log('🏆 Final leaderboard entries:', entries.length);
    if (entries.length > 0) {
      console.log('Top 3 entries:', entries.slice(0, 3));
      
      // Save to cache for faster future loads (if we have a department)
      if (departmentId && entries.length > 0) {
        try {
          const cacheRef = doc(db, 'leaderboardCache', departmentId);
          await setDoc(cacheRef, {
            departmentId,
            entries: entries.map(e => ({
              studentId: e.studentId,
              studentName: e.displayName,
              email: e.email,
              averageScore: e.averageScore,
              examCount: e.totalAttempts,
              rankPosition: e.rankPosition
            })),
            totalStudents: entries.length,
            lastUpdated: new Date(),
            expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
          });
          console.log('💾 Saved calculated data to cache for future use');
        } catch (cacheError) {
          console.warn('⚠️ Could not save to cache (non-critical):', cacheError);
          // Don't throw - cache save failure shouldn't break the leaderboard
        }
      }
    }

    return entries;
  } catch (error) {
    console.error('❌ Error getting simple leaderboard:', error);
    console.error('Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error;
  }
}

/**
 * Get departments for dropdown
 */
export async function getDepartments() {
  try {
    const db = getFirestore();
    const snapshot = await getDocs(collection(db, 'departments'));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting departments:', error);
    return [];
  }
}
