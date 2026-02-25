/**
 * Leaderboard data fetching hooks
 * 
 * Requirements: 6.3, 6.5
 * - Uses database aggregation queries for efficient ranking calculation (6.3)
 * - Displays cached leaderboard data within 2 seconds of page load (6.5)
 */

export { useLeaderboard } from './use-leaderboard';
export { useStudentRank } from './use-student-rank';
