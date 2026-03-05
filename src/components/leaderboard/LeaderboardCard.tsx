import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Crown, TrendingUp, Award, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { LeaderboardEntry } from "@/integrations/firebase/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";

interface LeaderboardCardProps {
  entries: LeaderboardEntry[];
  isLoading?: boolean;
  className?: string;
  currentUserId?: string;
  rankChanges?: Map<string, number>; // Map of studentId to rank change
  enableAnimation?: boolean; // Enable rank change animations (default: true)
}

const getRankIcon = (position: number) => {
  switch (position) {
    case 1:
      return <Crown className="h-5 w-5" />;
    case 2:
      return <Trophy className="h-5 w-5" />;
    case 3:
      return <Medal className="h-5 w-5" />;
    default:
      return null;
  }
};

const getRankColor = (position: number) => {
  switch (position) {
    case 1:
      return {
        bg: "bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20",
        border: "border-yellow-300 dark:border-yellow-700",
        icon: "text-yellow-600 dark:text-yellow-400",
        badge: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
        text: "text-yellow-700 dark:text-yellow-400"
      };
    case 2:
      return {
        bg: "bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-950/20 dark:to-slate-950/20",
        border: "border-gray-300 dark:border-gray-600",
        icon: "text-gray-600 dark:text-gray-400",
        badge: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
        text: "text-gray-700 dark:text-gray-400"
      };
    case 3:
      return {
        bg: "bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20",
        border: "border-orange-300 dark:border-orange-700",
        icon: "text-orange-600 dark:text-orange-400",
        badge: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
        text: "text-orange-700 dark:text-orange-400"
      };
    default:
      return {
        bg: "bg-white dark:bg-background",
        border: "border-border",
        icon: "text-muted-foreground",
        badge: "bg-muted text-muted-foreground",
        text: "text-foreground"
      };
  }
};

export function LeaderboardCard({ 
  entries, 
  isLoading = false, 
  className,
  currentUserId,
  rankChanges,
  enableAnimation = true
}: LeaderboardCardProps) {
  const { t } = useTranslation();
  
  // Track which entries should show animation
  const [animatingEntries, setAnimatingEntries] = useState<Set<string>>(new Set());
  
  // Trigger animations when rank changes are detected
  useEffect(() => {
    if (enableAnimation && rankChanges && rankChanges.size > 0) {
      const changedIds = new Set(rankChanges.keys());
      setAnimatingEntries(changedIds);
      
      // Clear animations after 3 seconds
      const timer = setTimeout(() => {
        setAnimatingEntries(new Set());
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [rankChanges, enableAnimation]);

  if (isLoading) {
    return (
      <Card className={cn("border-0 shadow-lg rounded-2xl overflow-hidden", className)}>
        <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-500 p-6">
          <CardTitle className="text-white flex items-center gap-2">
            <Award className="h-6 w-6" />
            {t("leaderboard.title", "Leaderboard")}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-xl border">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-6 w-16" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (entries.length === 0) {
    return (
      <Card className={cn("border-0 shadow-lg rounded-2xl overflow-hidden", className)}>
        <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-500 p-6">
          <CardTitle className="text-white flex items-center gap-2">
            <Award className="h-6 w-6" />
            {t("leaderboard.title", "Leaderboard")}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-12 text-center">
          <Trophy className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
          <p className="text-lg font-medium text-muted-foreground mb-2">
            {t("leaderboard.empty.title", "No Rankings Yet")}
          </p>
          <p className="text-sm text-muted-foreground">
            {t("leaderboard.empty.description", "Complete exams to appear on the leaderboard")}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("border-0 shadow-lg rounded-2xl overflow-hidden", className)}>
      <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-500 p-6">
        <CardTitle className="text-white flex items-center gap-2">
          <Award className="h-6 w-6" />
          {t("leaderboard.title", "Leaderboard")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-3">
        {entries.map((entry) => {
          const rankColors = getRankColor(entry.rankPosition);
          const rankIcon = getRankIcon(entry.rankPosition);
          const isCurrentUser = entry.studentId === currentUserId;
          const isTopThree = entry.rankPosition <= 3;
          const rankChange = rankChanges?.get(entry.studentId) || 0;
          const isAnimating = animatingEntries.has(entry.studentId);

          return (
            <div
              key={entry.studentId}
              className={cn(
                "flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-300",
                rankColors.bg,
                rankColors.border,
                isCurrentUser && "ring-2 ring-cyan-500 ring-offset-2",
                isTopThree && "shadow-md hover:shadow-lg",
                isAnimating && "scale-105 shadow-xl"
              )}
            >
              {/* Rank Position */}
              <div className="flex-shrink-0 relative">
                {rankIcon ? (
                  <div className={cn(
                    "h-10 w-10 rounded-full flex items-center justify-center transition-transform duration-300",
                    entry.rankPosition === 1 && "bg-yellow-100 dark:bg-yellow-900/30",
                    entry.rankPosition === 2 && "bg-gray-100 dark:bg-gray-900/30",
                    entry.rankPosition === 3 && "bg-orange-100 dark:bg-orange-900/30",
                    isAnimating && "scale-110"
                  )}>
                    <span className={rankColors.icon}>
                      {rankIcon}
                    </span>
                  </div>
                ) : (
                  <div className={cn(
                    "h-10 w-10 rounded-full bg-muted flex items-center justify-center transition-transform duration-300",
                    isAnimating && "scale-110"
                  )}>
                    <span className="text-lg font-bold text-muted-foreground">
                      {entry.rankPosition}
                    </span>
                  </div>
                )}
                
                {/* Rank Change Indicator */}
                {isAnimating && rankChange !== 0 && (
                  <div className={cn(
                    "absolute -top-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center text-white text-xs font-bold animate-in fade-in zoom-in duration-300",
                    rankChange > 0 ? "bg-green-500" : "bg-red-500"
                  )}>
                    {rankChange > 0 ? (
                      <ArrowUp className="h-3 w-3" />
                    ) : (
                      <ArrowDown className="h-3 w-3" />
                    )}
                  </div>
                )}
              </div>

              {/* Student Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className={cn(
                    "font-semibold truncate",
                    isTopThree ? rankColors.text : "text-foreground"
                  )}>
                    {entry.studentName}
                  </p>
                  {isCurrentUser && (
                    <Badge variant="outline" className="text-xs border-cyan-500 text-cyan-600">
                      {t("leaderboard.you", "You")}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {entry.examCount} {t("leaderboard.exams", "exams")}
                  </span>
                  <span>•</span>
                  <span>
                    {t("leaderboard.avgScore", "Avg")}: {entry.averageScore.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Points Badge */}
              <div className="flex-shrink-0">
                <Badge className={cn(
                  "text-sm font-bold px-3 py-1",
                  rankColors.badge
                )}>
                  {entry.totalPoints} {t("leaderboard.pts", "pts")}
                </Badge>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
