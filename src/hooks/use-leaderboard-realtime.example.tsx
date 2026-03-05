/**
 * Example: Using Real-Time Leaderboard Updates
 * 
 * This example demonstrates how to use the enhanced leaderboard hooks
 * with real-time Firestore listeners and rank change animations.
 * 
 * Requirements: 4.6, 6.5
 * - Real-time listeners for leaderboard changes (4.6)
 * - Smooth animations for rank position changes (4.6)
 * - Fast loading with cached data (6.5)
 * - Graceful offline handling
 */

import React from 'react';
import { useLeaderboard } from './use-leaderboard';
import { useStudentRank } from './use-student-rank';
import { LeaderboardCard } from '@/components/leaderboard/LeaderboardCard';
import { StudentRankingItem } from '@/components/leaderboard/StudentRankingItem';

/**
 * Example 1: Basic Real-Time Leaderboard
 * 
 * The hook automatically sets up real-time listeners and handles
 * connection states, offline scenarios, and animations.
 */
export function BasicRealtimeLeaderboard({ departmentId, currentUserId }: {
  departmentId: string;
  currentUserId: string;
}) {
  const {
    entries,
    loading,
    error,
    isConnected,
    getRankChanges,
    refetch
  } = useLeaderboard(departmentId); // Real-time enabled by default

  const rankChanges = getRankChanges();

  return (
    <div>
      {/* Connection Status Indicator */}
      {!isConnected && (
        <div className="mb-4 p-2 bg-yellow-100 text-yellow-800 rounded">
          ⚠️ Real-time updates temporarily unavailable. Showing cached data.
        </div>
      )}

      {/* Leaderboard with Animations */}
      <LeaderboardCard
        entries={entries}
        isLoading={loading}
        currentUserId={currentUserId}
        rankChanges={rankChanges}
        enableAnimation={true}
      />

      {/* Manual Refresh Button */}
      <button
        onClick={() => refetch()}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Force Refresh
      </button>

      {error && (
        <div className="mt-4 p-2 bg-red-100 text-red-800 rounded">
          {error}
        </div>
      )}
    </div>
  );
}

/**
 * Example 2: Student Rank with Real-Time Updates
 * 
 * Track a specific student's rank with real-time updates
 * and rank change detection for animations.
 */
export function StudentRankDisplay({ departmentId, studentId }: {
  departmentId: string;
  studentId: string;
}) {
  const {
    rank,
    totalPoints,
    averageScore,
    examCount,
    loading,
    isConnected,
    getRankChange
  } = useStudentRank(departmentId, studentId); // Real-time enabled by default

  const rankChange = getRankChange();

  if (loading) {
    return <div>Loading your rank...</div>;
  }

  if (!rank) {
    return <div>Complete exams to get ranked!</div>;
  }

  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center gap-2">
        <h3 className="text-2xl font-bold">Rank #{rank}</h3>
        
        {/* Rank Change Indicator */}
        {rankChange > 0 && (
          <span className="text-green-500 text-sm">
            ↑ +{rankChange} positions
          </span>
        )}
        {rankChange < 0 && (
          <span className="text-red-500 text-sm">
            ↓ {Math.abs(rankChange)} positions
          </span>
        )}
      </div>

      <div className="mt-2 text-sm text-gray-600">
        <p>Total Points: {totalPoints}</p>
        <p>Average Score: {averageScore.toFixed(1)}%</p>
        <p>Exams Completed: {examCount}</p>
      </div>

      {/* Connection Status */}
      {!isConnected && (
        <div className="mt-2 text-xs text-yellow-600">
          Offline - showing cached data
        </div>
      )}
    </div>
  );
}

/**
 * Example 3: Disable Real-Time Updates
 * 
 * For scenarios where you want to control updates manually
 * or reduce real-time connections (e.g., admin dashboards).
 */
export function ManualLeaderboard({ departmentId }: {
  departmentId: string;
}) {
  const {
    entries,
    loading,
    refetch
  } = useLeaderboard(departmentId, false); // Disable real-time

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h2>Leaderboard (Manual Mode)</h2>
        <button
          onClick={() => refetch()}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      <LeaderboardCard
        entries={entries}
        isLoading={loading}
        enableAnimation={false} // Disable animations in manual mode
      />
    </div>
  );
}

/**
 * Example 4: Individual Ranking Item with Animation
 * 
 * Use StudentRankingItem component with rank change detection
 * for smooth animations when positions change.
 */
export function AnimatedRankingItem({ entry, currentUserId, rankChanges }: {
  entry: any;
  currentUserId: string;
  rankChanges: Map<string, number>;
}) {
  const rankChange = rankChanges.get(entry.studentId) || 0;

  return (
    <StudentRankingItem
      entry={entry}
      isCurrentUser={entry.studentId === currentUserId}
      rankChange={rankChange}
      enableAnimation={true}
    />
  );
}

/**
 * How Real-Time Updates Work:
 * 
 * 1. Initial Load:
 *    - Hook fetches cached data from Firestore (fast, <2s)
 *    - Sets up real-time listener on leaderboardCache/{departmentId}
 * 
 * 2. Real-Time Updates:
 *    - When exam results are submitted, backend trigger updates cache
 *    - Firestore listener detects change and updates UI automatically
 *    - Rank changes are detected and animations are triggered
 * 
 * 3. Offline Handling:
 *    - If connection is lost, isConnected becomes false
 *    - Cached data remains visible
 *    - Error messages are suppressed for Firebase init errors (tests)
 * 
 * 4. Cleanup:
 *    - Listeners are automatically unsubscribed on unmount
 *    - No memory leaks or dangling connections
 * 
 * 5. Animation System:
 *    - Previous rank positions are tracked
 *    - getRankChanges() returns Map of studentId -> rank change
 *    - Positive values = moved up, Negative = moved down
 *    - Animations show for 3 seconds then fade out
 */
