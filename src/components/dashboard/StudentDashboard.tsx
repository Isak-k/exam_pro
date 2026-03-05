import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getPublishedExams } from "@/lib/firebase-exams";
import { getStudentAttempts } from "@/lib/firebase-attempts";
import { SimpleLeaderboard } from "@/components/SimpleLeaderboard";
import { StatCard } from "./StatCard";
import { ExamCard } from "@/components/exam/ExamCard";
import { ClipboardList, Trophy, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
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

interface StudentStats {
  availableExams: number;
  completedExams: number;
  averageScore: number;
  upcomingExams: number;
}

export function StudentDashboard() {
  const { user, profile } = useAuth();
  const { t } = useTranslation();
  const [stats, setStats] = useState<StudentStats>({
    availableExams: 0,
    completedExams: 0,
    averageScore: 0,
    upcomingExams: 0,
  });
  const [availableExams, setAvailableExams] = useState<ExamData[]>([]);
  const [upcomingExams, setUpcomingExams] = useState<ExamData[]>([]);
  const [attemptedExamIds, setAttemptedExamIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      try {
        // Fetch published exams with department filter
        const examsData = await getPublishedExams(profile?.departmentId);
        
        // Fetch user's attempts
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

        const attemptedIds = new Set(attempts.map((a) => a.examId));
        setAttemptedExamIds(attemptedIds);

        const now = new Date();
        const active = mappedExams.filter(
          (e) =>
            (!e.start_time || new Date(e.start_time) <= now) &&
            (!e.end_time || new Date(e.end_time) >= now) &&
            !attemptedIds.has(e.id)
        );

        const upcoming = mappedExams.filter(
          (e) => e.start_time && new Date(e.start_time) > now
        );

        const completed = attempts.filter((a) => a.isSubmitted);
        const totalScore = completed.reduce((sum, a) => sum + (a.totalScore || 0), 0);
        const maxScore = completed.reduce((sum, a) => sum + (a.maxScore || 0), 0);
        const avgScore = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

        setStats({
          availableExams: active.length,
          completedExams: completed.length,
          averageScore: avgScore,
          upcomingExams: upcoming.length,
        });

        setAvailableExams(active.slice(0, 4));
        setUpcomingExams(upcoming.slice(0, 4));
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user && profile) {
      fetchDashboardData();
    }
  }, [user, profile]);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-display font-bold">
            {t("dashboard.welcome", { name: profile?.full_name?.split(" ")[0] })}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t("dashboard.studentSubtitle")}
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <StatCard
          title={t("dashboard.stats.availableExams")}
          value={stats.availableExams}
          icon={<ClipboardList className="h-6 w-6" />}
          className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-background border-blue-100 dark:border-blue-900/50"
        />
        <StatCard
          title={t("dashboard.stats.completedExams")}
          value={stats.completedExams}
          icon={<CheckCircle className="h-6 w-6" />}
          className="bg-gradient-to-br from-green-50 to-white dark:from-green-950/20 dark:to-background border-green-100 dark:border-green-900/50"
        />
        <StatCard
          title={t("dashboard.stats.averageScore")}
          value={`${stats.averageScore}%`}
          icon={<Trophy className="h-6 w-6" />}
          className="bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/20 dark:to-background border-amber-100 dark:border-amber-900/50"
        />
        <StatCard
          title={t("dashboard.stats.upcomingExams")}
          value={stats.upcomingExams}
          icon={<Clock className="h-6 w-6" />}
          className="bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-background border-purple-100 dark:border-purple-900/50"
        />
      </div>

      {/* Leaderboard Section - Only show if no permission errors */}
      {profile?.departmentId && (
        <div className="w-full">
          <SimpleLeaderboard departmentId={profile.departmentId} />
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-display font-bold flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-primary" />
              {t("dashboard.availableExams")}
            </h2>
            <Button variant="ghost" size="sm" asChild className="text-primary hover:text-primary/80">
              <Link to="/dashboard/exams">{t("common.viewAll")}</Link>
            </Button>
          </div>

          {loading ? (
            <div className="grid gap-4">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="h-32 rounded-xl bg-muted animate-pulse"
                />
              ))}
            </div>
          ) : availableExams.length > 0 ? (
            <div className="grid gap-4">
              {availableExams.map((exam) => (
                <ExamCard
                  key={exam.id}
                  exam={exam}
                  hasAttempted={attemptedExamIds.has(exam.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-muted/30 rounded-2xl border border-dashed border-muted-foreground/20">
              <div className="h-16 w-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <ClipboardList className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-medium mb-1">{t("dashboard.noAvailableExams")}</h3>
              <p className="text-muted-foreground text-sm max-w-[250px] mx-auto">
                {t("dashboard.checkBackLater")}
              </p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-display font-bold flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              {t("dashboard.upcomingExams")}
            </h2>
          </div>

          {loading ? (
            <div className="grid gap-4">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="h-32 rounded-xl bg-muted animate-pulse"
                />
              ))}
            </div>
          ) : upcomingExams.length > 0 ? (
            <div className="grid gap-4">
              {upcomingExams.map((exam) => (
                <ExamCard
                  key={exam.id}
                  exam={exam}
                  hasAttempted={false}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-muted/30 rounded-2xl border border-dashed border-muted-foreground/20">
              <div className="h-16 w-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-medium mb-1">{t("dashboard.noUpcomingExams")}</h3>
              <p className="text-muted-foreground text-sm max-w-[250px] mx-auto">
                {t("dashboard.checkBackLater")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
