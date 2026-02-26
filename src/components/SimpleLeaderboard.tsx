import React, { useEffect } from 'react';
import { useSimpleLeaderboard } from '@/hooks/use-leaderboard';
import { Trophy, Crown, Award, Sparkles, RefreshCw } from 'lucide-react';

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
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 p-6 shadow-2xl">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        <div className="relative text-center py-12 text-white">
          <div className="animate-spin mx-auto mb-4">
            <Trophy className="w-12 h-12" />
          </div>
          <p className="text-lg font-semibold">Loading Leaderboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    const isPermissionError = error.includes('permission') || error.includes('insufficient');
    
    if (isPermissionError) {
      return (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 p-6 shadow-2xl">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
          <div className="relative text-center py-12 text-white">
            <Trophy className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-semibold mb-2">Leaderboard is being set up</p>
            <p className="text-sm opacity-80">Check back soon to see your ranking!</p>
          </div>
        </div>
      );
    }
    
    return (
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-600 via-pink-600 to-purple-600 p-6 shadow-2xl">
        <div className="relative text-center py-8 text-white">
          <p className="text-lg font-semibold mb-4">Error loading leaderboard</p>
          <button 
            onClick={refetch}
            className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all font-semibold"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const topThree = entries.slice(0, 3);
  const restOfList = entries.slice(3); // Show ALL remaining students, not just top 10

  // Arrange podium: 2nd, 1st, 3rd
  const podiumOrder = [topThree[1], topThree[0], topThree[2]].filter(Boolean);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 shadow-2xl">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
      
      <div className="relative p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-2xl">
            <Sparkles className="w-5 h-5 text-yellow-300" />
            <h2 className="text-2xl font-bold text-white tracking-wide">Leaderboard</h2>
            <Sparkles className="w-5 h-5 text-yellow-300" />
          </div>
        </div>

        {entries.length === 0 ? (
          <div className="text-center py-12 text-white">
            <Trophy className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-semibold">No rankings yet</p>
            <p className="text-sm opacity-80 mt-2">Complete exams to appear on the leaderboard!</p>
          </div>
        ) : (
          <>
            {/* Podium - Top 3 */}
            <div className="flex items-end justify-center gap-2 sm:gap-4 mb-6 px-2">
              {podiumOrder.map((entry, idx) => {
                if (!entry) return null;
                const actualRank = entry.rankPosition;
                const podiumHeight = actualRank === 1 ? 'h-40' : actualRank === 2 ? 'h-32' : 'h-28';
                const trophyColor = actualRank === 1 ? 'text-yellow-400' : actualRank === 2 ? 'text-gray-300' : 'text-amber-600';
                const bgGradient = actualRank === 1 
                  ? 'from-yellow-400 to-orange-500' 
                  : actualRank === 2 
                  ? 'from-gray-300 to-gray-400' 
                  : 'from-amber-500 to-orange-600';

                return (
                  <div key={entry.studentId} className="flex-1 max-w-[140px]">
                    {/* Trophy and Avatar */}
                    <div className="flex flex-col items-center mb-2">
                      {actualRank === 1 && <Crown className="w-8 h-8 text-yellow-300 mb-1 animate-bounce" />}
                      <div className="relative">
                        <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br ${bgGradient} flex items-center justify-center shadow-lg ring-4 ring-white/30`}>
                          <Trophy className={`w-8 h-8 sm:w-10 sm:h-10 ${trophyColor}`} />
                        </div>
                        {actualRank === 1 && (
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold text-yellow-900 shadow-lg">
                            1
                          </div>
                        )}
                      </div>
                      <div className="mt-2 text-center">
                        <p className="text-white font-bold text-sm sm:text-base truncate max-w-[120px]">
                          {entry.displayName}
                        </p>
                        <p className="text-white/90 text-xl sm:text-2xl font-bold mt-1">
                          {entry.bestScore}<span className="text-sm">%</span>
                        </p>
                      </div>
                    </div>
                    
                    {/* Podium Block */}
                    <div className={`${podiumHeight} bg-gradient-to-t ${bgGradient} rounded-t-2xl flex items-center justify-center shadow-xl relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-white/10"></div>
                      <span className="relative text-4xl sm:text-5xl font-bold text-white/40">
                        {actualRank}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Rest of the list */}
            {restOfList.length > 0 && (
              <div className="space-y-2 mt-6">
                {restOfList.map((entry) => (
                  <div
                    key={entry.studentId}
                    className="flex items-center justify-between px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center font-bold text-white shadow-lg flex-shrink-0">
                        {entry.rankPosition}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white truncate">{entry.displayName}</p>
                        <p className="text-xs text-white/70">
                          {entry.totalAttempts} attempts
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <p className="text-xl font-bold text-white">
                        {entry.bestScore}<span className="text-sm">%</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Refresh Button */}
            <button
              onClick={refetch}
              className="w-full mt-6 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-2xl hover:bg-white/30 transition-all font-semibold text-white flex items-center justify-center gap-2 shadow-lg"
            >
              <RefreshCw className="w-5 h-5" />
              Refresh Leaderboard
            </button>
          </>
        )}
      </div>
    </div>
  );
}
