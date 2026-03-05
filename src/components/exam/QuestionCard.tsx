import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";
import { useTranslation } from "react-i18next";

interface QuestionCardProps {
  questionNumber: number;
  questionText: string;
  options: string[];
  selectedOption: number | null;
  correctOption?: number;
  feedbackType: "instant" | "hidden";
  isSubmitted: boolean;
  onSelectOption: (index: number) => void;
  marks: number;
  explanation?: string;
}

export function QuestionCard({
  questionNumber,
  questionText,
  options,
  selectedOption,
  correctOption,
  feedbackType,
  isSubmitted,
  onSelectOption,
  marks,
  explanation,
}: QuestionCardProps) {
  const { t } = useTranslation();
  const showFeedback = feedbackType === "instant" && selectedOption !== null;
  const showResults = isSubmitted; // Renamed for clarity, effectively same as isSubmitted in this context for final results
  const showExplanation = (showFeedback || showResults) && explanation;

  const getOptionClass = (index: number) => {
    // If exam is submitted, show results
    if (showResults) {
      if (index === correctOption) return "bg-green-500/10 border-green-500 text-green-700"; // Correct answer
      if (index === selectedOption && index !== correctOption) return "bg-destructive/10 border-destructive text-destructive"; // Wrong answer
      return "opacity-50 border-border"; // Unselected options
    }

    // If instant feedback is enabled and user has selected an option
    if (showFeedback) {
      if (index === correctOption) return "bg-green-500/10 border-green-500 text-green-700"; // Show correct answer
      if (index === selectedOption && index !== correctOption) return "bg-destructive/10 border-destructive text-destructive"; // Show wrong selection
    }

    // Default state (for hidden feedback or before selection)
    if (index === selectedOption) return "bg-primary/10 border-primary text-primary font-medium"; // Selected state
    
    return "hover:bg-accent hover:border-accent-foreground/20 border-border"; // Default state
  };

  return (
    <div className="bg-card rounded-xl border p-6 space-y-6 animate-fade-in">
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-4">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-display font-semibold shrink-0">
            {questionNumber}
          </div>
          <div className="space-y-1">
            <p className="text-lg font-medium leading-relaxed">{questionText}</p>
            <p className="text-sm text-muted-foreground">{t("student.exam.card.marks", { count: marks })}</p>
          </div>
        </div>
      </div>

      <div className="space-y-3 pl-14">
        {options.map((option, index) => {
          const isSelected = selectedOption === index;
          const isCorrect = index === correctOption;
          const showCorrectIcon = showFeedback && isCorrect;
          const showIncorrectIcon = showFeedback && isSelected && !isCorrect;

          return (
            <button
              key={index}
              onClick={() => !isSubmitted && !showFeedback && onSelectOption(index)}
              disabled={isSubmitted || showFeedback}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-lg text-left transition-all border",
                getOptionClass(index),
                (isSubmitted || showFeedback) && "cursor-default"
              )}
            >
              <div
                className={cn(
                  "h-6 w-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
                  isSelected
                    ? showIncorrectIcon
                      ? "border-destructive bg-destructive text-destructive-foreground"
                      : (showCorrectIcon || (showResults && isCorrect))
                      ? "border-green-500 bg-green-500 text-white"
                      : "border-primary bg-primary text-primary-foreground"
                    : "border-border"
                )}
              >
                {(showCorrectIcon || (showResults && isCorrect)) && (
                  <Check className="h-4 w-4" />
                )}
                {showIncorrectIcon && <X className="h-4 w-4" />}
              </div>
              <span className="flex-1">{option}</span>
            </button>
          );
        })}
      </div>

      {showExplanation && (
        <div className="mt-4 ml-14 p-4 bg-muted/50 rounded-lg border border-muted animate-fade-in">
          <p className="font-semibold text-sm mb-1">{t("student.exam.card.explanation")}</p>
          <p className="text-sm text-muted-foreground">{explanation}</p>
        </div>
      )}
    </div>
  );
}
