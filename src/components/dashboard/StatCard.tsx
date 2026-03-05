import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: ReactNode;
  trend?: {
    value: number;
    positive: boolean;
  };
  className?: string;
  gradient?: "cyan" | "green" | "yellow" | "red" | "blue";
}

const gradientClasses = {
  cyan: "bg-gradient-to-br from-cyan-50 to-white dark:from-cyan-950/20 dark:to-background",
  green: "bg-gradient-to-br from-green-50 to-white dark:from-green-950/20 dark:to-background",
  yellow: "bg-gradient-to-br from-yellow-50 to-white dark:from-yellow-950/20 dark:to-background",
  red: "bg-gradient-to-br from-red-50 to-white dark:from-red-950/20 dark:to-background",
  blue: "bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-background",
};

const iconClasses = {
  cyan: "bg-cyan-500/10 text-cyan-600",
  green: "bg-green-500/10 text-green-600",
  yellow: "bg-yellow-500/10 text-yellow-600",
  red: "bg-red-500/10 text-red-600",
  blue: "bg-blue-500/10 text-blue-600",
};

const valueClasses = {
  cyan: "text-cyan-600",
  green: "text-green-600",
  yellow: "text-yellow-600",
  red: "text-red-600",
  blue: "text-blue-600",
};

export function StatCard({
  title,
  value,
  description,
  icon,
  trend,
  className,
  gradient = "cyan",
}: StatCardProps) {
  const { t } = useTranslation();
  
  return (
    <Card className={cn("border-0 shadow-md", gradientClasses[gradient], className)}>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2 flex-1">
            <p className="text-sm text-muted-foreground font-medium">{title}</p>
            <p className={cn("text-3xl font-display font-bold", valueClasses[gradient])}>
              {value}
            </p>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
            {trend && (
              <div className="flex items-center gap-1 mt-2">
                <span
                  className={cn(
                    "text-sm font-medium",
                    trend.positive ? "text-green-600" : "text-red-600"
                  )}
                >
                  {trend.positive ? "+" : "-"}{Math.abs(trend.value)}%
                </span>
                <span className="text-xs text-muted-foreground">
                  {t("exam.stat.vsLastWeek")}
                </span>
              </div>
            )}
          </div>
          <div className={cn(
            "h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0",
            iconClasses[gradient]
          )}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
