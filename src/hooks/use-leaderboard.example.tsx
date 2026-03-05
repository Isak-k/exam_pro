/**
 * Example usage of leaderboard hooks
 * 
 * This file demonstrates how to use useLeaderboard and useStudentRank hooks
 * in React components.
 */

import React from 'react';
import { useLeaderboard, useStudentRank } from './use-leaderboard-hooks';

/**
 * Example 1: Display full leaderboard for a department
 */
export function LeaderboardExample() {
  const departmentId = 'dept-123';
  const { entries, totalStudents, loading, error, refetch } = useLeaderboard(departmentId);

  if (loading) {
    return <div>Loading leaderboard...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Department Leaderboard</h2>
      <p>Total Students: {totalStudents}</p>
      <button onClick={() => refetch()}>Refresh</button>
      
      <ul>
        {entries.map((entry) => (
          <li key={entry.studentId}>
            #{entry.rankPosition} - {entry.studentName} - {entry.totalPoints} points
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Example 2: Display individual student rank
 */
export function StudentRankExample() {
  const departmentId = 'dept-123';
  const studentId = 'student-456';
  
  const { rank, totalPoints, averageScore, examCount, loading, error } = 
    useStudentRank(departmentId, studentId);

  if (loading) {
    return <div>Loading your rank...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (rank === null) {
    return <div>No ranking yet. Take an exam to get ranked!</div>;
  }

  return (
    <div>
      <h2>Your Ranking</h2>
      <p>Rank: #{rank}</p>
      <p>Total Points: {totalPoints}</p>
      <p>Average Score: {averageScore.toFixed(1)}%</p>
      <p>Exams Taken: {examCount}</p>
    </div>
  );
}

/**
 * Example 3: Combined view with both hooks
 */
export function CombinedLeaderboardView() {
  const departmentId = 'dept-123';
  const studentId = 'student-456';
  
  const leaderboard = useLeaderboard(departmentId);
  const studentRank = useStudentRank(departmentId, studentId);

  if (leaderboard.loading || studentRank.loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="student-stats">
        <h3>Your Stats</h3>
        {studentRank.rank !== null ? (
          <>
            <p>Your Rank: #{studentRank.rank} out of {leaderboard.totalStudents}</p>
            <p>Your Points: {studentRank.totalPoints}</p>
          </>
        ) : (
          <p>Take an exam to get ranked!</p>
        )}
      </div>

      <div className="leaderboard">
        <h3>Top Students</h3>
        {leaderboard.entries.slice(0, 10).map((entry) => (
          <div 
            key={entry.studentId}
            className={entry.studentId === studentId ? 'highlight' : ''}
          >
            #{entry.rankPosition} - {entry.studentName} - {entry.totalPoints} pts
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Example 4: Handling undefined department/student IDs
 */
export function SafeLeaderboardExample({ 
  departmentId, 
  studentId 
}: { 
  departmentId?: string; 
  studentId?: string;
}) {
  const { entries, loading, error } = useLeaderboard(departmentId);

  // Hook handles undefined gracefully
  if (!departmentId) {
    return <div>Please select a department</div>;
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Leaderboard</h2>
      {entries.map((entry) => (
        <div key={entry.studentId}>
          {entry.rankPosition}. {entry.studentName}
        </div>
      ))}
    </div>
  );
}
