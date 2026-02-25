import { useEffect, useState } from "react";
import { getAdminAnalytics, AdminAnalyticsData } from "@/lib/firebase-admin";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/StatCard";
import { Loader2, Users, FileText, CheckCircle, TrendingUp, BarChart3 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useTranslation } from "react-i18next";

interface ExamStats {
  name: string;
  attempts: number;
  avgScore: number;
}

const AdminAnalytics = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalExams: 0,
    totalAttempts: 0,
    averageScore: 0,
  });
  const [examStats, setExamStats] = useState<ExamStats[]>([]);
  const [scoreDistribution, setScoreDistribution] = useState<{ name: string; value: number }[]>([]);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const data = await getAdminAnalytics();
      setStats(data.stats);
      setExamStats(data.examStats);
      setScoreDistribution(data.scoreDistribution);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444"];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl lg:text-3xl font-display font-bold">{t("admin.analytics.title")}</h1>
          <p className="text-muted-foreground mt-1">
            {t("admin.analytics.subtitle")}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title={t("admin.analytics.stats.totalStudents")}
            value={stats.totalStudents}
            icon={<Users className="h-6 w-6" />}
          />
          <StatCard
            title={t("admin.analytics.stats.totalExams")}
            value={stats.totalExams}
            icon={<FileText className="h-6 w-6" />}
          />
          <StatCard
            title={t("admin.analytics.stats.completedAttempts")}
            value={stats.completedAttempts}
            icon={<CheckCircle className="h-6 w-6" />}
          />
          <StatCard
            title={t("admin.analytics.stats.averageScore")}
            value={`${stats.averageScore}%`}
            icon={<TrendingUp className="h-6 w-6" />}
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {examStats.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  {t("admin.analytics.charts.examPerformance")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={examStats}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="avgScore" fill="hsl(173, 58%, 39%)" radius={[4, 4, 0, 0]} name={t("admin.analytics.charts.avgScoreLabel")} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {scoreDistribution.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t("admin.analytics.charts.scoreDistribution")}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={scoreDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {scoreDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>

        {examStats.length === 0 && scoreDistribution.length === 0 && (
          <Card className="py-12">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium mb-2">{t("admin.analytics.empty.title")}</h3>
              <p className="text-muted-foreground text-sm">
                {t("admin.analytics.empty.description")}
              </p>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminAnalytics;
