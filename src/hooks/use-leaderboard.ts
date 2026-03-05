import { useState, useEffect, useCallback } from 'react';
import { getSimpleLeaderboard, LeaderboardEntry } from '@/lib/simple-leaderboard';

/**
 * Simple leaderboard hook that works without Cloud Functions
 */
export function useSimpleLeaderboard(departmentId?: string) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSimpleLeaderboard(departmentId);
      setEntries(data);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch leaderboard');
    } finally {
      setLoading(false);
    }
  }, [departmentId]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  return {
    entries,
    loading,
    error,
    refetch: fetchLeaderboard,
    totalStudents: entries.length
  };
}

// Keep the old useLeaderboard export for backward compatibility
export function useLeaderboard(
  departmentId: string | undefined, 
  enableRealtime: boolean = true,
  pageSize: number = 50
) {
  return useSimpleLeaderboard(departmentId);
}
