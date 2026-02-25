import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Crown, TrendingUp, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { LeaderboardEntry } from "@/integrations/firebase/types";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";

interface StudentRankingItemProps {
  entry: LeaderboardEntry;
  isCurrentUser?: boolean;
  nextRankPoints?: number; // Points needed to reach next rank
  className?: string;
  rankChange?: number; // Positive = moved up, Negative = moved down, 0 = no change
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
        text: "text-yellow-700 dark:text-yellow-400",
        progress: "bg-yellow-500"
      };
    case 2:
      return {
        bg: "bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-950/20 dark:to-slate-950/20",
        border: "border-gray-300 dark:border-gray-600",
        icon: "text-gray-600 dark:text-gray-400",
        badge: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
        text: "text-gray-700 dark:text-gray-400",
        progress: "bg-gray-500"
      };
    case 3:
      return {
        bg: "bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20",
        border: "border-orange-300 dark:border-orange-700",
        icon: "text-orange-600 dark:text-orange-400",
        badge: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
        text: "text-orange-700 dark:text-orange-400",
        progress: "bg-orange-500"
      };
    default:
      return {
        bg: "bg-white dark:bg-background",
        border: "border-border",
        icon: "text-muted-foreground",
        badge: "bg-muted text-muted-foreground",
        text: "text-foreground",
        progress: "bg-primary"
      };
  }
};

export function StudentRankingItem({
  entry,
  isCurrentUser = false,
  nextRankPoints,
  className,
  rankChange = 0,
  enableAnimation = true
}: StudentRankingItemProps) {
  const { t } = useTranslation();
  const rankColors = getRankColor(entry.rankPosition);
  const rankIcon = getRankIcon(entry.rankPosition);
  const isTopThree = entry.rankPosition <= 3;
  
  // Animation state for rank changes
  const [showRankChange, setShowRankChange] = useState(false);
  const [animateEntry, setAnimateEntry] = useState(false);

  // Trigger animation when rank changes
  useEffect(() => {
    if (enableAnimation && rankChange !== 0) {
      setShowRankChange(true);
      setAnimateEntry(true);
      
      // Hide rank change indicator after 3 seconds
      const timer = setTimeout(() => {
        setShowRankChange(false);
      }, 3000);
      
      // Reset animation state after animation completes
      const animTimer = setTimeout(() => {
        setAnimateEntry(false);
      }, 500);

      return () => {
        clearTimeout(timer);
        clearTimeout(animTimer);
      };
    }
  }, [rankChange, enableAnimation]);

  // Calculate progress to next rank
  const pointsToNextRank = nextRankPoints ? nextRankPoints - entry.totalPoints : 0;
  const progressPercentage = nextRankPoints 
    ? Math.min(100, (entry.totalPoints / nextRankPoints) * 100)
    : 100;

  return (
    <div
      className={cn(
        "flex flex-col gap-3 p-4 rounded-xl border-2 transition-all duration-300",
        rankColors.bg,
        rankColors.border,
        isCurrentUser && "ring-2 ring-cyan-500 ring-offset-2",
        isTopThree && "shadow-md hover:shadow-lg",
        animateEntry && "scale-105 shadow-xl",
        className
      )}
    >
      {/* Main Row: Rank, Student Info, Points */}
      <div className="flex items-center gap-4">
        {/* Rank Position */}
        <div className="flex-shrink-0 relative">
          {rankIcon ? (
            <div className={cn(
              "h-10 w-10 rounded-full flex items-center justify-center transition-transform duration-300",
              entry.rankPosition === 1 && "bg-yellow-100 dark:bg-yellow-900/30",
              entry.rankPosition === 2 && "bg-gray-100 dark:bg-gray-900/30",
              entry.rankPosition === 3 && "bg-orange-100 dark:bg-orange-900/30",
              animateEntry && "scale-110"
            )}>
              <span className={rankColors.icon}>
                {rankIcon}
              </span>
            </div>
          ) : (
            <div className={cn(
              "h-10 w-10 rounded-full bg-muted flex items-center justify-center transition-transform duration-300",
              animateEntry && "scale-110"
            )}>
              <span className="text-lg font-bold text-muted-foreground">
                {entry.rankPosition}
              </span>
            </div>
          )}
          
          {/* Rank Change Indicator */}
          {showRankChange && rankChange !== 0 && (
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

      {/* Progress Bar to Next Rank */}
      {nextRankPoints && pointsToNextRank > 0 && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{t("leaderboard.nextRank", "Next rank")}</span>
            <span className="font-medium">
              {pointsToNextRank} {t("leaderboard.ptsNeeded", "pts needed")}
            </span>
          </div>
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div 
              className={cn("h-full transition-all duration-300", rankColors.progress)}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* At Top Rank Message */}
      {nextRankPoints && pointsToNextRank <= 0 && entry.rankPosition === 1 && (
        <div className="text-xs text-center font-medium text-muted-foreground">
          🏆 {t("leaderboard.topRank", "You're at the top!")}
        </div>
      )}
    </div>
  );
}
