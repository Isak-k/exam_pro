import { useEffect, useState } from "react";
import { getAdminAnalytics, AdminAnalyticsData } from "@/lib/firebase-admin";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/StatCard";
import { Loader2, Users, FileText, CheckCircle, TrendingUp, BarChart3, Activity, Award } from "lucide-react";
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
  LineChart,
  Line,
  Legend,
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
    completedAttempts: 0,
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

  const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444"];
  const GRADIENT_COLORS = {
    primary: "hsl(173, 58%, 39%)",
    secondary: "hsl(221, 83%, 53%)",
    success: "hsl(142, 71%, 45%)",
    warning: "hsl(38, 92%, 50%)",
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">Loading analytics...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const completionRate = stats.totalAttempts > 0 
    ? Math.round((stats.completedAttempts / stats.totalAttempts) * 100) 
    : 0;

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {t("admin.analytics.title")}
            </h1>
            <p className="text-muted-foreground mt-2">
              {t("admin.analytics.subtitle")}
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Activity className="h-4 w-4" />
            <span>Real-time data</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <StatCard
            title={t("admin.analytics.stats.totalStudents")}
            value={stats.totalStudents}
            icon={<Users className="h-6 w-6" />}
            className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-background border-blue-100 dark:border-blue-900/50 hover:shadow-lg transition-shadow"
          />
          <StatCard
            title={t("admin.analytics.stats.totalExams")}
            value={stats.totalExams}
            icon={<FileText className="h-6 w-6" />}
            className="bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-background border-purple-100 dark:border-purple-900/50 hover:shadow-lg transition-shadow"
          />
          <StatCard
            title={t("admin.analytics.stats.completedAttempts")}
            value={stats.completedAttempts}
            icon={<CheckCircle className="h-6 w-6" />}
            className="bg-gradient-to-br from-green-50 to-white dark:from-green-950/20 dark:to-background border-green-100 dark:border-green-900/50 hover:shadow-lg transition-shadow"
          />
          <StatCard
            title={t("admin.analytics.stats.averageScore")}
            value={`${stats.averageScore}%`}
            icon={<TrendingUp className="h-6 w-6" />}
            className="bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/20 dark:to-background border-amber-100 dark:border-amber-900/50 hover:shadow-lg transition-shadow"
          />
        </div>

        {/* Additional Metrics */}
        <div className="grid sm:grid-cols-2 gap-4">
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                  <p className="text-3xl font-bold mt-2">{completionRate}%</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats.completedAttempts} of {stats.totalAttempts} attempts
                  </p>
                </div>
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Award className="h-8 w-8 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Attempts per Exam</p>
                  <p className="text-3xl font-bold mt-2">
                    {stats.totalExams > 0 ? (stats.totalAttempts / stats.totalExams).toFixed(1) : 0}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Total {stats.totalAttempts} attempts
                  </p>
                </div>
                <div className="h-16 w-16 rounded-full bg-secondary/10 flex items-center justify-center">
                  <Activity className="h-8 w-8 text-secondary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {examStats.length > 0 && (
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-transparent">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  {t("admin.analytics.charts.examPerformance")}
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Average scores across all exams
                </p>
              </CardHeader>
              <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={examStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={GRADIENT_COLORS.primary} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={GRADIENT_COLORS.primary} stopOpacity={0.3}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="name" 
                      fontSize={12} 
                      tickLine={false}
                      axisLine={{ stroke: '#e5e7eb' }}
                    />
                    <YAxis 
                      fontSize={12}
                      tickLine={false}
                      axisLine={{ stroke: '#e5e7eb' }}
                      domain={[0, 100]}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: '8px', 
                        border: '1px solid #e5e7eb',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                    />
                    <Bar 
                      dataKey="avgScore" 
                      fill="url(#colorScore)" 
                      radius={[8, 8, 0, 0]} 
                      name={t("admin.analytics.charts.avgScoreLabel")}
                      maxBarSize={60}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {scoreDistribution.length > 0 && (
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader className="border-b bg-gradient-to-r from-secondary/5 to-transparent">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5 text-secondary" />
                  {t("admin.analytics.charts.scoreDistribution")}
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Student performance breakdown
                </p>
              </CardHeader>
              <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie
                      data={scoreDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={110}
                      fill="#8884d8"
                      dataKey="value"
                      paddingAngle={2}
                    >
                      {scoreDistribution.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]}
                          stroke="#fff"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: '8px', 
                        border: '1px solid #e5e7eb',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {scoreDistribution.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-muted-foreground">{item.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Empty State */}
        {examStats.length === 0 && scoreDistribution.length === 0 && (
          <Card className="py-16 border-2 border-dashed">
            <div className="text-center">
              <div className="h-20 w-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{t("admin.analytics.empty.title")}</h3>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">
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
