import { useEffect, useState } from "react";
import { formatDistanceToNow, isPast, isFuture, differenceInMinutes } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Clock, AlertCircle, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getDateLocale } from "@/lib/utils";

interface ExamCountdownProps {
  startTime: string | null;
  endTime: string | null;
}

export function ExamCountdown({ startTime, endTime }: ExamCountdownProps) {
  const [, setTick] = useState(0);
  const { t, i18n } = useTranslation();

  // Update every minute
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 60000);
    return () => clearInterval(interval);
  }, []);

  if (startTime && isFuture(new Date(startTime))) {
    const minutesUntil = differenceInMinutes(new Date(startTime), new Date());
    
    if (minutesUntil <= 60) {
      return (
        <Badge variant="outline" className="badge-warning gap-1.5 animate-pulse">
          <Clock className="h-3 w-3" />
          {t("exam.info.startsIn", { time: minutesUntil })}
        </Badge>
      );
    }
    
    return (
      <Badge variant="outline" className="badge-info gap-1.5">
        <Clock className="h-3 w-3" />
        {t("exam.info.starts", { time: formatDistanceToNow(new Date(startTime), { addSuffix: true, locale: getDateLocale(i18n.language) }) })}
      </Badge>
    );
  }

  if (endTime && isFuture(new Date(endTime))) {
    const minutesUntil = differenceInMinutes(new Date(endTime), new Date());
    
    if (minutesUntil <= 30) {
      return (
        <Badge variant="outline" className="badge-danger gap-1.5 animate-pulse">
          <AlertCircle className="h-3 w-3" />
          {t("exam.info.endsIn", { time: minutesUntil })}
        </Badge>
      );
    }
    
    return (
      <Badge variant="outline" className="badge-success gap-1.5">
        <CheckCircle className="h-3 w-3" />
        {t("exam.info.openNow")}
      </Badge>
    );
  }

  if (endTime && isPast(new Date(endTime))) {
    return (
      <Badge variant="outline" className="badge-danger gap-1.5">
        <AlertCircle className="h-3 w-3" />
        {t("exam.status.ended")}
      </Badge>
    );
  }

  return null;
}
