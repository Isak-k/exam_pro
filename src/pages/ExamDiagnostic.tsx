import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/integrations/firebase/client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle, AlertCircle, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getPublishedExams } from "@/lib/firebase-exams";

export default function ExamDiagnostic() {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [exams, setExams] = useState<any[]>([]);
  const [studentViewExams, setStudentViewExams] = useState<any[]>([]);

  useEffect(() => {
    checkExams();
  }, []);

  const checkExams = async () => {
    try {
      const examsRef = collection(db, 'exams');
      const snapshot = await getDocs(examsRef);
      
      const examsList = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          docId: doc.id,
          examId: data.examId,
          title: data.title,
          isPublished: data.isPublished,
          departmentId: data.departmentId,
          hasExamId: !!data.examId,
          examIdMatches: data.examId === doc.id
        };
      });
      
      setExams(examsList);
      
      // Also check what students would see
      try {
        const studentExams = await getPublishedExams(profile?.departmentId);
        setStudentViewExams(studentExams);
      } catch (error) {
        console.error("Error getting student view:", error);
      }
    } catch (error) {
      console.error("Error checking exams:", error);
    } finally {
      setLoading(false);
    }
  };

  const publishedExams = exams.filter(e => e.isPublished);
  const examsWithoutExamId = exams.filter(e => !e.hasExamId);
  const examsMismatch = exams.filter(e => e.hasExamId && !e.examIdMatches);
  const studentVisibleCount = studentViewExams.length;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-display font-bold">Exam Diagnostic</h1>
          <p className="text-muted-foreground mt-2">
            Check if exams have the required examId field
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-primary">{exams.length}</p>
                    <p className="text-sm text-muted-foreground mt-1">Total Exams</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600">{publishedExams.length}</p>
                    <p className="text-sm text-muted-foreground mt-1">Published</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-600">{studentVisibleCount}</p>
                    <p className="text-sm text-muted-foreground mt-1">Student Can See</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-red-600">{examsWithoutExamId.length}</p>
                    <p className="text-sm text-muted-foreground mt-1">Missing examId</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-yellow-600">{examsMismatch.length}</p>
                    <p className="text-sm text-muted-foreground mt-1">Mismatched IDs</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Student View Info */}
            {profile?.departmentId && (
              <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <Users className="h-6 w-6 text-blue-600" />
                    <div>
                      <p className="font-semibold text-blue-900 dark:text-blue-100">
                        Student View (Your Department: {profile.departmentId})
                      </p>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        Students in your department can see {studentVisibleCount} out of {publishedExams.length} published exams.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Issue Alert */}
            {examsWithoutExamId.length > 0 && (
              <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-red-500/20 flex items-center justify-center">
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <CardTitle className="text-red-900 dark:text-red-100">
                        Action Required: Missing examId Fields
                      </CardTitle>
                      <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                        {examsWithoutExamId.length} exam(s) are missing the examId field. 
                        Students cannot see these exams.
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button asChild className="bg-red-600 hover:bg-red-700">
                    <Link to="/migrate-exams">
                      Run Migration to Fix
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Success Message */}
            {examsWithoutExamId.length === 0 && exams.length > 0 && (
              <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <div>
                      <p className="font-semibold text-green-900 dark:text-green-100">
                        All exams have examId field!
                      </p>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        Students should be able to see published exams.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Exam List */}
            <Card>
              <CardHeader>
                <CardTitle>Exam Details</CardTitle>
              </CardHeader>
              <CardContent>
                {exams.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No exams found in database
                  </p>
                ) : (
                  <div className="space-y-3">
                    {exams.map((exam, index) => (
                      <div
                        key={exam.docId}
                        className="flex items-start gap-3 p-4 rounded-lg border bg-card"
                      >
                        <div className="flex-shrink-0 mt-1">
                          {exam.hasExamId && exam.examIdMatches ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : exam.hasExamId ? (
                            <AlertCircle className="h-5 w-5 text-yellow-600" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-medium">{exam.title}</p>
                            {exam.isPublished && (
                              <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                Published
                              </span>
                            )}
                          </div>
                          <div className="mt-2 space-y-1 text-sm">
                            <p className="text-muted-foreground">
                              <span className="font-medium">Doc ID:</span> {exam.docId}
                            </p>
                            <p className="text-muted-foreground">
                              <span className="font-medium">examId field:</span>{" "}
                              {exam.hasExamId ? (
                                <span className={exam.examIdMatches ? "text-green-600" : "text-yellow-600"}>
                                  {exam.examId}
                                  {!exam.examIdMatches && " (mismatch!)"}
                                </span>
                              ) : (
                                <span className="text-red-600">Missing!</span>
                              )}
                            </p>
                            <p className="text-muted-foreground">
                              <span className="font-medium">Department:</span>{" "}
                              {exam.departmentId ? (
                                <span className="text-blue-600">{exam.departmentId}</span>
                              ) : (
                                <span className="text-green-600">All Departments</span>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle>What does this mean?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Green check:</p>
                    <p className="text-muted-foreground">
                      Exam has examId field and it matches the document ID. Students can see this exam.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Red X:</p>
                    <p className="text-muted-foreground">
                      Exam is missing the examId field. Students CANNOT see this exam. Run migration to fix.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Yellow warning:</p>
                    <p className="text-muted-foreground">
                      Exam has examId but it doesn't match document ID. This might cause issues.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
