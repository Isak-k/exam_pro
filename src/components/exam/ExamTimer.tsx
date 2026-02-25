import { useEffect, useState, useRef } from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExamTimerProps {
  durationMinutes: number;
  startedAt: Date;
  onTimeUp: () => void;
}

export function ExamTimer({ durationMinutes, startedAt, onTimeUp }: ExamTimerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const onTimeUpRef = useRef(onTimeUp);

  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const endTime = new Date(startedAt.getTime() + durationMinutes * 60 * 1000);
      const remaining = Math.max(0, Math.floor((endTime.getTime() - now.getTime()) / 1000));
      return remaining;
    };

    setTimeLeft(calculateTimeLeft());

    const interval = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        onTimeUpRef.current();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [durationMinutes, startedAt]);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const percentage = (timeLeft / (durationMinutes * 60)) * 100;
  const isWarning = percentage <= 25 && percentage > 10;
  const isDanger = percentage <= 10;

  const formatTime = (value: number) => value.toString().padStart(2, "0");

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-lg font-mono font-semibold text-lg transition-all",
        isDanger
          ? "timer-danger"
          : isWarning
          ? "timer-warning"
          : "timer-safe"
      )}
    >
      <Clock className="h-5 w-5" />
      <span>
        {hours > 0 && `${formatTime(hours)}:`}
        {formatTime(minutes)}:{formatTime(seconds)}
      </span>
    </div>
  );
}
