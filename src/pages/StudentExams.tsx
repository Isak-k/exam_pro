import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getPublishedExams } from "@/lib/firebase-exams";
import { getStudentAttempts } from "@/lib/firebase-attempts";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ExamCard } from "@/components/exam/ExamCard";
import { Loader2, ClipboardList } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ExamData {
  id: string;
  title: string;
  description: string | null;
  duration_minutes: number;
  start_time: string | null;
  end_time: string | null;
  is_published: boolean;
}

const StudentExams = () => {
  const { user, profile } = useAuth();
  const { t } = useTranslation();
  const [exams, setExams] = useState<ExamData[]>([]);
  const [attemptedExamIds, setAttemptedExamIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && profile) {
      fetchExams();
    }
  }, [user, profile]);

  const fetchExams = async () => {
    if (!user) return;

    try {
      // Pass the student's department ID to filter exams
      const examsData = await getPublishedExams(profile?.departmentId);
      const attempts = await getStudentAttempts(user.uid);

      const mappedExams = examsData.map(exam => ({
        id: exam.examId,
        title: exam.title,
        description: exam.description,
        duration_minutes: exam.durationMinutes,
        start_time: exam.startTime?.toDate().toISOString() || null,
        end_time: exam.endTime?.toDate().toISOString() || null,
        is_published: exam.isPublished
      }));

      setAttemptedExamIds(new Set(attempts.map((a) => a.examId)));
      setExams(mappedExams);
    } catch (error) {
      console.error("Error fetching exams:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl lg:text-3xl font-display font-bold">
            {t("student.exams.title")}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t("student.exams.subtitle")}
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : exams.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {exams.map((exam) => (
              <ExamCard
                key={exam.id}
                exam={exam}
                hasAttempted={attemptedExamIds.has(exam.id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <ClipboardList className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium">{t("student.exams.empty.title")}</h3>
            <p className="text-muted-foreground mt-1 max-w-sm">
              {t("student.exams.empty.description")}
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentExams;
