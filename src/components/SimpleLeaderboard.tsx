import React, { useEffect } from 'react';
import { useSimpleLeaderboard } from '@/hooks/use-leaderboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Medal, Award } from 'lucide-react';

interface SimpleLeaderboardProps {
  departmentId?: string;
  refreshSignal?: number;
}

export function SimpleLeaderboard({ departmentId, refreshSignal }: SimpleLeaderboardProps) {
  const { entries, loading, error, refetch } = useSimpleLeaderboard(departmentId);

  console.log('SimpleLeaderboard render:', { entries: entries.length, loading, error, departmentId });

  useEffect(() => {
    if (typeof refreshSignal === 'number') {
      refetch();
    }
  }, [refreshSignal, refetch]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Loading leaderboard...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    // If it's a permission error, show a friendly message instead of error
    const isPermissionError = error.includes('permission') || error.includes('insufficient');
    
    if (isPermissionError) {
      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-gray-400" />
              Leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Trophy className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-sm text-gray-500 mb-4">
                Leaderboard is being set up
              </p>
              <p className="text-xs text-gray-400">
                Check back soon to see your ranking!
              </p>
            </div>
          </CardContent>
        </Card>
      );
    }
    
    return (
      <Card>
        <CardHeader>
          <CardTitle>Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-red-500 mb-4">
              Error: {error}
            </div>
            <button 
              onClick={refetch}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold">{position}</span>;
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="bg-gradient-to-b from-indigo-600 via-violet-600 to-purple-700 p-6 text-white">
        <div className="flex items-center justify-center">
          <div className="text-xl font-bold tracking-wide">Leaderboard</div>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-4">
          {[0,1,2].map((idx) => {
            const entry = entries[idx];
            const pos = idx + 1;
            return (
              <div key={entry?.studentId || idx} className={`rounded-xl p-4 text-center ${pos===1 ? 'bg-white/15 ring-2 ring-yellow-300' : 'bg-white/10'} backdrop-blur-sm`}>
                <div className="flex items-center justify-center gap-2">
                  {getRankIcon(pos)}
                  <span className="font-semibold">{pos === 1 ? '#1' : pos === 2 ? '#2' : '#3'}</span>
                </div>
                <div className="mt-2 text-sm">{entry ? entry.displayName : '—'}</div>
                <div className="mt-1 text-xs opacity-80">{entry ? `${entry.bestScore}%` : ''}</div>
              </div>
            );
          })}
        </div>
      </div>
      <CardContent className="p-0">
        {entries.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No leaderboard data available</div>
        ) : (
          <div className="p-4 space-y-2">
            {entries.slice(3, 13).map((entry) => (
              <div
                key={entry.studentId}
                className="flex items-center justify-between px-4 py-3 rounded-xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-purple-200 dark:bg-purple-800 flex items-center justify-center font-bold text-purple-700 dark:text-purple-200">
                    {entry.rankPosition}
                  </div>
                  <div>
                    <div className="font-medium">{entry.displayName}</div>
                    <div className="text-xs text-muted-foreground">
                      {entry.totalAttempts} attempts • Avg: {entry.averageScore}%
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">{entry.bestScore}%</div>
                  <div className="text-xs text-muted-foreground">Best Score</div>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="p-4 pt-2">
          <button
            onClick={refetch}
            className="w-full px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
          >
            Refresh Leaderboard
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
