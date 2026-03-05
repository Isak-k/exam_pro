import { useEffect, useCallback } from "react";

interface KeyboardShortcuts {
  onNext?: () => void;
  onPrevious?: () => void;
  onSubmit?: () => void;
  onNumber?: (num: number) => void;
  enabled?: boolean;
}

export function useExamKeyboardNavigation({
  onNext,
  onPrevious,
  onSubmit,
  onNumber,
  enabled = true,
}: KeyboardShortcuts) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled) return;
      
      // Ignore if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (e.key) {
        case "ArrowRight":
        case "n":
          e.preventDefault();
          onNext?.();
          break;
        case "ArrowLeft":
        case "p":
          e.preventDefault();
          onPrevious?.();
          break;
        case "Enter":
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            onSubmit?.();
          }
          break;
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
          e.preventDefault();
          onNumber?.(parseInt(e.key) - 1);
          break;
      }
    },
    [enabled, onNext, onPrevious, onSubmit, onNumber]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}
