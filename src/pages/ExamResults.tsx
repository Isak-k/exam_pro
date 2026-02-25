import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getExam, updateExam } from "@/lib/firebase-exams";
import { getExamAttempts } from "@/lib/firebase-attempts";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Loader2,
  Download,
  FileText,
  FileSpreadsheet,
  ArrowLeft,
  Users,
  TrendingUp,
  Award,
  Eye,
  EyeOff,
  Trophy,
} from "lucide-react";
import { toast } from "sonner";
import {
  exportToCSV,
  exportToPDF,
  formatTimeSpent,
  type ExamResultData,
  type ExamSummary,
} from "@/lib/export-utils";

interface AttemptWithStudent {
  id: string;
  studentId: string;
  totalScore: number | null;
  maxScore: number | null;
  submittedAt: string | null;
  timeSpentSeconds: number | null;
  studentName: string;
  studentEmail: string;
}

interface ExamInfo {
  id: string;
  title: string;
  description: string | null;
  resultsPublished: boolean;
}

const ExamResults = () => {
  const { examId } = useParams<{ examId: string }>();
  const { role, user } = useAuth();
  const navigate = useNavigate();
  const [exam, setExam] = useState<ExamInfo | null>(null);
  const [attempts, setAttempts] = useState<AttemptWithStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    if (examId && user) {
      fetchExamResults();
    }
  }, [examId, user]);

  const fetchExamResults = async () => {
    try {
      if (!examId || !user) return;

      // Fetch exam info
      const examData = await getExam(examId);

      if (!examData) {
        toast.error("Exam not found");
        navigate("/dashboard/admin/exams");
        return;
      }

      // Check permissions: Admin or Creator
      if (role !== 'admin' && examData.createdBy !== user.uid) {
        toast.error("You do not have permission to view these results");
        navigate("/dashboard");
        return;
      }

      setExam({
        id: examData.examId,
        title: examData.title,
        description: examData.description,
        resultsPublished: examData.resultsPublished
      });

      // Fetch attempts
      const attemptsData = await getExamAttempts(examId);
      const submittedAttempts = attemptsData.filter(a => a.isSubmitted);

      const formattedAttempts = submittedAttempts.map(attempt => ({
        id: attempt.attemptId,
        studentId: attempt.studentId,
        totalScore: attempt.totalScore,
        maxScore: attempt.maxScore,
        submittedAt: attempt.submittedAt?.toDate().toISOString() || null,
        timeSpentSeconds: attempt.timeSpentSeconds,
        studentName: attempt.studentName,
        studentEmail: attempt.studentEmail
      }));

      // Sort by submittedAt desc
      formattedAttempts.sort((a, b) => {
        const dateA = a.submittedAt ? new Date(a.submittedAt).getTime() : 0;
        const dateB = b.submittedAt ? new Date(b.submittedAt).getTime() : 0;
        return dateB - dateA;
      });

      setAttempts(formattedAttempts);
    } catch (error) {
      console.error("Error fetching results:", error);
      toast.error("Failed to load results");
    } finally {
      setLoading(false);
    }
  };

  const getExportData = (): ExamResultData[] => {
    return attempts.map((a) => ({
      studentName: a.studentName,
      studentEmail: a.studentEmail,
      examTitle: exam?.title || "",
      score: a.totalScore || 0,
      maxScore: a.maxScore || 0,
      percentage: a.maxScore ? Math.round(((a.totalScore || 0) / a.maxScore) * 100) : 0,
      submittedAt: a.submittedAt
        ? new Date(a.submittedAt).toLocaleString()
        : "N/A",
      timeSpent: formatTimeSpent(a.timeSpentSeconds),
    }));
  };

  const getSummary = (): ExamSummary => {
    const percentages = attempts.map((a) =>
      a.maxScore ? Math.round(((a.totalScore || 0) / a.maxScore) * 100) : 0
    );
    const passCount = percentages.filter((p) => p >= 60).length;

    return {
      title: exam?.title || "",
      totalAttempts: attempts.length,
      averageScore: percentages.length
        ? Math.round(percentages.reduce((a, b) => a + b, 0) / percentages.length)
        : 0,
      highestScore: percentages.length ? Math.max(...percentages) : 0,
      lowestScore: percentages.length ? Math.min(...percentages) : 0,
      passRate: attempts.length
        ? Math.round((passCount / attempts.length) * 100)
        : 0,
    };
  };

  const handleExportCSV = () => {
    setExporting(true);
    try {
      const data = getExportData();
      const filename = `${exam?.title?.replace(/\s+/g, "_") || "exam"}_results_${new Date().toISOString().split("T")[0]}`;
      exportToCSV(data, filename);
      toast.success("CSV exported successfully");
    } catch (error) {
      toast.error("Failed to export CSV");
    } finally {
      setExporting(false);
    }
  };

  const handleExportPDF = () => {
    setExporting(true);
    try {
      const data = getExportData();
      const summary = getSummary();
      const filename = `${exam?.title?.replace(/\s+/g, "_") || "exam"}_results_${new Date().toISOString().split("T")[0]}`;
      exportToPDF(data, summary, filename);
      toast.success("PDF exported successfully");
    } catch (error) {
      toast.error("Failed to export PDF");
    } finally {
      setExporting(false);
    }
  };

  const togglePublishResults = async () => {
    if (!exam || !examId) return;

    setPublishing(true);
    try {
      const newPublishedStatus = !exam.resultsPublished;
      await updateExam(examId, { resultsPublished: newPublishedStatus });

      setExam({ ...exam, resultsPublished: newPublishedStatus });
      toast.success(
        newPublishedStatus
          ? "Results published successfully"
          : "Results hidden successfully"
      );
    } catch (error) {
      console.error("Error updating exam:", error);
      toast.error("Failed to update publish status");
    } finally {
      setPublishing(false);
    }
  };

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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/dashboard/admin/exams">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{exam?.title} - Results</h1>
              <p className="text-muted-foreground text-sm">
                {attempts.length} total attempts
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={exam?.resultsPublished ? "secondary" : "default"}
              onClick={togglePublishResults}
              disabled={publishing}
            >
              {exam?.resultsPublished ? (
                <>
                  <EyeOff className="h-4 w-4 mr-2" />
                  Hide Results
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Publish Results
                </>
              )}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" disabled={exporting || attempts.length === 0}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleExportCSV}>
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportPDF}>
                  <FileText className="h-4 w-4 mr-2" />
                  Export as PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Summary Cards */}
        {attempts.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Attempts</p>
                    <p className="text-2xl font-bold">{getSummary().totalAttempts}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Score</p>
                    <p className="text-2xl font-bold">{getSummary().averageScore}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <Award className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pass Rate</p>
                    <p className="text-2xl font-bold">{getSummary().passRate}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Trophy className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Highest</p>
                    <p className="text-2xl font-bold">{getSummary().highestScore}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Results Table */}
        <Card>
          <CardHeader>
            <CardTitle>Student Results</CardTitle>
          </CardHeader>
          <CardContent>
            {attempts.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead className="text-center">Score</TableHead>
                      <TableHead className="text-center">Percentage</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Time Spent</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attempts.map((attempt) => {
                      const percentage = attempt.maxScore
                        ? Math.round(((attempt.totalScore || 0) / attempt.maxScore) * 100)
                        : 0;

                      return (
                        <TableRow key={attempt.id}>
                          <TableCell className="font-medium">
                            {attempt.studentName}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {attempt.studentEmail}
                          </TableCell>
                          <TableCell className="text-center">
                            {attempt.totalScore || 0}/{attempt.maxScore || 0}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge
                              variant="outline"
                              className={
                                percentage >= 60
                                  ? "badge-success"
                                  : percentage >= 40
                                  ? "badge-warning"
                                  : "badge-danger"
                              }
                            >
                              {percentage}%
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {attempt.submittedAt
                              ? new Date(attempt.submittedAt).toLocaleString()
                              : "N/A"}
                          </TableCell>
                          <TableCell>
                            {formatTimeSpent(attempt.timeSpentSeconds || 0)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium mb-2">No attempts yet</h3>
                <p className="text-muted-foreground text-sm">
                  Students haven't taken this exam yet.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ExamResults;
