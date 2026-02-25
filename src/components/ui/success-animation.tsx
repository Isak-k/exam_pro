import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface SuccessAnimationProps {
  show: boolean;
  message?: string;
  className?: string;
}

export function SuccessAnimation({ show, message = "Success!", className }: SuccessAnimationProps) {
  if (!show) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in",
        className
      )}
    >
      <div className="flex flex-col items-center gap-4 animate-scale-in">
        <div className="h-20 w-20 rounded-full bg-success/10 flex items-center justify-center">
          <CheckCircle className="h-10 w-10 text-success animate-bounce" />
        </div>
        <p className="text-xl font-display font-semibold">{message}</p>
      </div>
    </div>
  );
}
