import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getExam, getQuestions } from "@/lib/firebase-exams";
import { createAttempt, saveAnswer, submitAttempt, getAttempt, getAnswers, getStudentAttempts } from "@/lib/firebase-attempts";
import { QuestionCard } from "@/components/exam/QuestionCard";
import { ExamTimer } from "@/components/exam/ExamTimer";
import { KeyboardShortcutsHelp } from "@/components/exam/KeyboardShortcutsHelp";
import { useExamKeyboardNavigation } from "@/hooks/use-keyboard-navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { Loader2, ChevronLeft, ChevronRight, Send, AlertTriangle, CheckCircle, AlertCircle } from "lucide-react";

interface Question {
  questionId: string;
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  feedbackType: "instant" | "hidden";
  explanation?: string;
  marks: number;
  orderIndex: number;
}

interface Exam {
  examId: string;
  title: string;
  description: string | null;
  durationMinutes: number;
  maxAttempts: number;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  accessPassword?: string | null;
}

const TakeExam = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const tr = (key: string, fallback: string, options?: Record<string, any>) => {
    const val = t(key, options as any);
    return val === key ? fallback : val;
  };

  const [exam, setExam] = useState<Exam | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<string, number>>(new Map());
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [startedAt, setStartedAt] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showStartDialog, setShowStartDialog] = useState(true);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [enteredPassword, setEnteredPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    const checkExistingAttempt = async () => {
      if (!user || !id) return;
  
      try {
        // Fetch exam details
        const examData = await getExam(id);
  
        if (!examData) {
          toast({
            title: "Exam not found",
            variant: "destructive",
          });
          navigate("/dashboard");
          return;
        }
  
        setExam(examData);
  
        // Check for existing attempts
        const attempts = await getStudentAttempts(user.uid, id);
        const incompleteAttempt = attempts.find(a => !a.isSubmitted);
        const submittedCount = attempts.filter(a => a.isSubmitted).length;
  
        // Check max attempts
        if (!incompleteAttempt && submittedCount >= examData.maxAttempts) {
          toast({
            title: "Maximum attempts reached",
            description: `You have already taken this exam ${submittedCount} times.`,
            variant: "destructive",
          });
          navigate("/dashboard/results"); // Redirect to results instead of dashboard
          return;
        }
  
        if (incompleteAttempt) {
          setAttemptId(incompleteAttempt.attemptId);
          setStartedAt(incompleteAttempt.startedAt.toDate());
          setShowStartDialog(false);
          await loadQuestions(examData, incompleteAttempt.attemptId);
        } else {
          await loadQuestions(examData);
        }
  
        setLoading(false);
      } catch (error) {
        console.error("Error checking attempt:", error);
        toast({
          title: "Error loading exam",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    if (id && user) {
      checkExistingAttempt();
    }
  }, [id, user]);

  // Seeded random number generator
  const seededRandom = (seed: number) => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };

  const shuffleArray = <T,>(array: T[], seedStr: string): T[] => {
    const shuffled = [...array];
    let seed = 0;
    for (let i = 0; i < seedStr.length; i++) {
      seed += seedStr.charCodeAt(i);
    }

    for (let i = shuffled.length - 1; i > 0; i--) {
      // Use seeded random
      const r = seededRandom(seed + i); 
      const j = Math.floor(r * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const shuffleWithCorrectIndex = (options: string[], correctIndex: number, seedStr: string) => {
    const indexed = options.map((opt, idx) => ({ opt, isCorrect: idx === correctIndex }));
    const shuffled = shuffleArray(indexed, seedStr);
    return {
      options: shuffled.map((item) => item.opt),
      newCorrectIndex: shuffled.findIndex((item) => item.isCorrect),
    };
  };

  const loadQuestions = async (examData: Exam, attemptIdParam?: string) => {
    let questionsData: Question[] = [];
    try {
      questionsData = await getQuestions(examData.examId);
    } catch (e: any) {
      console.error("Failed to load questions:", e);
      toast({
        title: t("student.exam.loadingFailed"),
        description: e?.message || "Could not load questions",
        variant: "destructive",
      });
      return;
    }

    // Use attemptIdParam or a temporary seed if not yet started (preview)
    // Actually, if we haven't started, we don't have an attemptId.
    // But we need to show questions? No, we only show questions AFTER start.
    // Wait, loadQuestions is called with attemptIdParam only if resuming.
    // If starting new, we call loadQuestions(examData) without attemptId.
    // BUT, we only show questions after `startExam` creates the attempt and calls `loadQuestions` again?
    // Let's check `startExam`. It calls `loadQuestions(exam, attemptId)`.
    // So we ALWAYS have an attemptId when we actually show the questions.
    // The initial `loadQuestions(examData)` (line 96) is suspicious.
    // Ah, line 96 runs if NO incomplete attempt exists. It loads questions to `setQuestions`.
    // But at this point `showStartDialog` is true. The user can't see questions yet.
    // So the shuffle doesn't matter yet?
    // WRONG. If we shuffle here with a random seed, and then start exam and shuffle with `attemptId`,
    // the order might change if we don't reload.
    // `startExam` calls `loadQuestions` again (line 193). So it RE-SHUFFLES.
    // So the initial load is just to get question count?
    // Yes, for the dialog: "Questions: {questions.length}".
    // So we can skip shuffling in the initial load or just do a dummy shuffle.

    if (questionsData) {
      let processedQuestions = questionsData;
      const seed = attemptIdParam || "preview"; // Use consistent seed for preview

      if (examData.shuffleQuestions) {
        processedQuestions = shuffleArray(processedQuestions, seed);
      }

      if (examData.shuffleOptions) {
        processedQuestions = processedQuestions.map((q) => {
          // Combine question ID and attempt ID for unique per-question seed
          const questionSeed = `${seed}-${q.questionId}`;
          const shuffled = shuffleWithCorrectIndex(q.options, q.correctOptionIndex, questionSeed);
          return {
            ...q,
            options: shuffled.options,
            correctOptionIndex: shuffled.newCorrectIndex,
          };
        });
      }

      setQuestions(processedQuestions);

      // Load existing answers if resuming
      if (attemptIdParam) {
        const existingAnswers = await getAnswers(attemptIdParam);

        if (existingAnswers) {
          const answersMap = new Map<string, number>();
          existingAnswers.forEach((a) => {
            if (a.selectedOptionIndex !== null) {
              answersMap.set(a.questionId, a.selectedOptionIndex);
            }
          });
          setAnswers(answersMap);
        }
      }
    }
  };

  const startExam = async () => {
    if (!user || !exam || !user.uid) return;

    // Check password if required
    if (exam.accessPassword && exam.accessPassword.trim()) {
      if (!enteredPassword) {
        setShowStartDialog(false);
        setShowPasswordDialog(true);
        return;
      }
      
      if (enteredPassword !== exam.accessPassword) {
        setPasswordError(t("student.exam.passwordDialog.incorrect"));
        return;
      }
    }

    try {
      const profile = await import("@/lib/auth").then(m => m.getUserProfile(user.uid));
      
      const attemptId = await createAttempt(
        exam.examId,
        user.uid,
        exam.title,
        profile?.full_name || user.email || 'Student',
        user.email || ''
      );

      setAttemptId(attemptId);
      setStartedAt(new Date());
      setShowStartDialog(false);
      setShowPasswordDialog(false);
      setEnteredPassword("");
      setPasswordError("");
      await loadQuestions(exam, attemptId);
    } catch (error: any) {
      console.error("Error starting exam:", error);
      toast({
        title: t("student.exam.startFailed"),
        description: error?.message || "Could not create attempt",
        variant: "destructive",
      });
    }
  };

  const handleSelectOption = useCallback(async (questionId: string, optionIndex: number) => {
    if (!attemptId) return;

    const newAnswers = new Map(answers);
    newAnswers.set(questionId, optionIndex);
    setAnswers(newAnswers);

    // Save answer to database
    const question = questions.find((q) => q.questionId === questionId);
    const isCorrect = question ? optionIndex === question.correctOptionIndex : false;

    try {
      await saveAnswer(attemptId, questionId, {
        selectedOptionIndex: optionIndex,
        isCorrect,
        timeSpentSeconds: null,
        answeredAt: null
      });
    } catch (error) {
      console.error("Error saving answer:", error);
    }
  }, [attemptId, answers, questions]);

  const submitExam = async () => {
    if (!attemptId || !startedAt) return;

    setSubmitting(true);

    try {
      // Calculate score
      let totalScore = 0;
      let maxScore = 0;

      questions.forEach((q) => {
        maxScore += q.marks;
        const selectedOption = answers.get(q.questionId);
        if (selectedOption === q.correctOptionIndex) {
          totalScore += q.marks;
        }
      });

      const timeSpent = Math.floor((new Date().getTime() - startedAt.getTime()) / 1000);

      await submitAttempt(attemptId, totalScore, maxScore, timeSpent);

      toast({
        title: t("student.exam.submitted"),
        description: t("student.exam.submittedDesc"),
      });

      navigate("/dashboard/results");
    } catch (error) {
      console.error("Error submitting exam:", error);
      toast({
        title: t("student.exam.submitFailed"),
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
      setShowSubmitDialog(false);
    }
  };

  const handleTimeUp = useCallback(() => {
    toast({
      title: t("student.exam.timeUp.title"),
      description: t("student.exam.timeUp.description"),
      variant: "destructive",
    });
    submitExam();
  }, [submitExam, t]);

  const handleNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    }
  }, [currentIndex, questions.length]);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  }, [currentIndex]);

  const handleSelectOptionByNumber = useCallback((optionIndex: number) => {
    const currentQuestion = questions[currentIndex];
    if (currentQuestion && optionIndex < currentQuestion.options.length) {
      handleSelectOption(currentQuestion.questionId, optionIndex);
    }
  }, [questions, currentIndex, handleSelectOption]);

  // Enable keyboard navigation
  useExamKeyboardNavigation({
    onNext: handleNext,
    onPrevious: handlePrevious,
    onSubmit: () => setShowSubmitDialog(true),
    onNumber: handleSelectOptionByNumber,
    enabled: !!startedAt && !showSubmitDialog && !showStartDialog,
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground">{t("student.exam.loading")}</p>
        </div>
      </div>
    );
  }

  if (!exam) return null;

  const currentQuestion = questions[currentIndex];
  const answeredCount = answers.size;
  const progress = (answeredCount / questions.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Start Dialog */}
      <AlertDialog open={showStartDialog && !attemptId}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-xl">
              {exam.title}
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <p>{exam.description}</p>
              <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
                <p>• {tr("student.exam.startDialog.duration", `Duration: ${exam.durationMinutes} minutes`, { minutes: exam.durationMinutes })}</p>
                <p>• {tr("student.exam.startDialog.questions", `Questions: ${questions.length}`, { count: questions.length })}</p>
                <p>• {tr("student.exam.startDialog.timer", "The timer will start as soon as you begin")}</p>
                {exam.accessPassword && (
                  <p className="text-warning font-medium">• {tr("student.exam.startDialog.passwordRequired", "Password required to start")}</p>
                )}
              </div>
              <div className="flex items-center gap-2 text-warning">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm">{tr("student.exam.startDialog.warning", "Do not refresh or leave this page")}</span>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={() => navigate("/dashboard")}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300 transition-all duration-200 hover:shadow-md"
            >
              {tr("student.exam.startDialog.cancel", "Cancel")}
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={startExam} 
              className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              {tr("student.exam.startDialog.start", "Start Exam")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Password Dialog */}
      <AlertDialog open={showPasswordDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-xl">
              {t("student.exam.passwordDialog.title")}
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <p>{tr("student.exam.passwordDialog.description", "Enter the exam password to begin")}</p>
              <div className="space-y-2">
                <Label htmlFor="exam-password">{tr("student.exam.passwordDialog.label", "Exam Password")}</Label>
                <Input
                  id="exam-password"
                  type="password"
                  value={enteredPassword}
                  onChange={(e) => {
                    setEnteredPassword(e.target.value);
                    setPasswordError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      startExam();
                    }
                  }}
                  placeholder={tr("student.exam.passwordDialog.placeholder", "Enter exam password")}
                  className={`transition-all duration-200 border-2 rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 hover:border-gray-400 ${passwordError ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-gray-300"}`}
                  autoFocus
                />
                {passwordError && (
                  <p className="text-sm text-red-500">{passwordError}</p>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={() => {
                setShowPasswordDialog(false);
                setShowStartDialog(true);
                setEnteredPassword("");
                setPasswordError("");
              }}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300 transition-all duration-200 hover:shadow-md"
            >
              {tr("student.exam.passwordDialog.cancel", "Cancel")}
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={startExam} 
              className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              {tr("student.exam.passwordDialog.submit", "Start Exam")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Submit Confirmation Dialog */}
      <AlertDialog open={showSubmitDialog}>
        <AlertDialogContent className="sm:max-w-[440px]">
          <AlertDialogHeader className="space-y-4">
            <AlertDialogTitle className="text-2xl font-bold text-center">
              Submit Exam?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2 text-lg">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {answeredCount} of {questions.length} answered
                </span>
              </div>
              {answeredCount < questions.length && (
                <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/20 border-l-4 border-amber-400 rounded-r-lg">
                  <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span className="text-amber-800 dark:text-amber-300 text-sm text-left">
                    {questions.length - answeredCount} question{questions.length - answeredCount !== 1 ? 's' : ''} unanswered
                  </span>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-3 sm:gap-3">
            <AlertDialogCancel 
              onClick={() => setShowSubmitDialog(false)}
              className="w-full sm:flex-1 h-11 bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-300 hover:border-gray-400 transition-all duration-200 font-medium rounded-lg"
            >
              Continue Exam
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={submitExam}
              disabled={submitting}
              className="w-full sm:flex-1 h-11 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200 font-semibold rounded-lg"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Exam
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Exam Header */}
      {startedAt && (
        <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <h1 className="font-display font-semibold truncate">{exam.title}</h1>
                  <KeyboardShortcutsHelp />
                </div>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-sm text-muted-foreground">
                    {t("student.exam.question", { current: currentIndex + 1, total: questions.length })}
                  </span>
                  <Progress value={progress} className="w-24 h-2" />
                </div>
              </div>
              <ExamTimer
                durationMinutes={exam.durationMinutes}
                startedAt={startedAt}
                onTimeUp={handleTimeUp}
              />
            </div>
          </div>
        </header>
      )}

      {/* Question Content */}
      {currentQuestion && startedAt && (
        <main className="container mx-auto px-4 py-8 max-w-3xl">
          <QuestionCard
            questionNumber={currentIndex + 1}
            questionText={currentQuestion.questionText}
            options={currentQuestion.options}
            selectedOption={answers.get(currentQuestion.questionId) ?? null}
            correctOption={currentQuestion.correctOptionIndex}
            feedbackType={currentQuestion.feedbackType}
            isSubmitted={false}
            onSelectOption={(index) => handleSelectOption(currentQuestion.questionId, index)}
            marks={currentQuestion.marks}
            explanation={currentQuestion.explanation}
          />

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <Button
              variant="outline"
              onClick={() => setCurrentIndex((i) => i - 1)}
              disabled={currentIndex === 0}
              className="bg-white hover:bg-gray-50 text-gray-700 border-gray-300 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            {currentIndex === questions.length - 1 ? (
              <Button
                onClick={() => setShowSubmitDialog(true)}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Send className="h-4 w-4 mr-2" />
                Submit Exam
              </Button>
            ) : (
              <Button
                onClick={() => setCurrentIndex((i) => i + 1)}
                className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>

          {/* Question Navigator */}
          <div className="mt-8 p-4 bg-card rounded-xl border">
            <p className="text-sm font-medium mb-3">{t("student.exam.questionNavigator")}</p>
            <div className="flex flex-wrap gap-2">
              {questions.map((q, idx) => {
                const isAnswered = answers.has(q.questionId);
                const isCurrent = idx === currentIndex;

                return (
                  <button
                    key={q.questionId}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-9 w-9 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-110 ${
                      isCurrent
                        ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-lg"
                        : isAnswered
                        ? "bg-gradient-to-r from-green-400 to-emerald-400 text-white shadow-md hover:shadow-lg"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700 shadow-sm hover:shadow-md"
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </main>
      )}
    </div>
  );
};

export default TakeExam;
