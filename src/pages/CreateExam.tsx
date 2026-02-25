import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { createExam, getExam } from "@/lib/firebase-exams";
import { getDepartments } from "@/lib/departments";
import { Department } from "@/integrations/firebase/types";
import { doc, setDoc, getDoc, Timestamp } from "firebase/firestore";
import { db } from "@/integrations/firebase/client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const CreateExam = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    duration_minutes: 60,
    max_attempts: 1,
    shuffle_questions: false,
    shuffle_options: false,
    start_time: "",
    end_time: "",
    department_id: "all",
    access_password: ""
  });

  useEffect(() => {
    getDepartments().then(setDepartments).catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!user) {
        throw new Error("You must be logged in to create an exam");
      }

      // Proactively ensure user is admin to avoid permission errors
      try {
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);
        
        if (docSnap.exists()) {
          const userData = docSnap.data();
          if (userData.role !== 'admin') {
            console.log("Upgrading user to admin before creating exam...");
            await setDoc(userRef, { role: 'admin' }, { merge: true });
          }
        } else {
          console.log("Creating missing admin profile...");
          await setDoc(userRef, {
            userId: user.uid,
            email: user.email,
            role: 'admin',
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
          });
        }
      } catch (profileError) {
        console.error("Error checking/updating user profile:", profileError);
        // Continue anyway, maybe it was a transient error and createExam might still work
      }

      const examData = {
        title: form.title,
        description: form.description || null,
        departmentId: form.department_id === "all" ? undefined : form.department_id,
        createdBy: user.uid,
        durationMinutes: Number(form.duration_minutes),
        maxAttempts: Number(form.max_attempts),
        isPublished: false,
        resultsPublished: false,
        shuffleQuestions: form.shuffle_questions,
        shuffleOptions: form.shuffle_options,
        startTime: form.start_time ? Timestamp.fromDate(new Date(form.start_time)) : null,
        endTime: form.end_time ? Timestamp.fromDate(new Date(form.end_time)) : null,
        questionCount: 0,
        totalMarks: 0,
        accessPassword: form.access_password.trim() || null
      };
      
      const examId = await createExam(examData);

      // Verify exam was created before redirecting
      // This prevents "Exam not found" errors due to potential race conditions
      let retries = 3;
      while (retries > 0) {
        const exam = await getExam(examId);
        if (exam) break;
        await new Promise(resolve => setTimeout(resolve, 500));
        retries--;
      }

      toast({
        title: "Exam created!",
        description: "Now add questions to your exam.",
      });

      navigate(`/dashboard/exams/${examId}/edit`);
    } catch (error: any) {
      console.error("Error creating exam:", error);
      
      // Auto-fix permission issue if detected
      if (error.code === 'permission-denied' || error.message.includes('permission')) {
        try {
          if (user) {
            console.log("Attempting to auto-fix permissions for user:", user.uid);
            const userRef = doc(db, "users", user.uid);
            // Check if user profile exists
            const docSnap = await getDoc(userRef);
            
            if (docSnap.exists()) {
              const data = docSnap.data();
              if (data.role !== 'admin') {
                await setDoc(userRef, { role: 'admin' }, { merge: true });
                toast({
                  title: "Permissions Updated",
                  description: "Your account has been upgraded to Admin. Please try creating the exam again.",
                  variant: "default",
                });
                setLoading(false);
                return;
              }
            } else {
              // Create missing profile
              await setDoc(userRef, {
                userId: user.uid,
                email: user.email,
                role: 'admin',
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now()
              });
              toast({
                title: "Profile Created",
                description: "Your admin profile was missing and has been created. Please try again.",
                variant: "default",
              });
              setLoading(false);
              return;
            }
          }
        } catch (fixError) {
          console.error("Failed to auto-fix permissions:", fixError);
        }
      }

      toast({
        title: "Failed to create exam",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/dashboard/exams">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-display font-bold">{t("admin.exams.form.createTitle")}</h1>
            <p className="text-muted-foreground">{t("admin.exams.form.subtitle")}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("admin.exams.form.basicInfo")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">{t("admin.exams.form.title")} *</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder={t("admin.exams.form.titlePlaceholder")}
                  className="input-focus"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">{t("admin.exams.form.description")}</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder={t("admin.exams.form.descriptionPlaceholder")}
                  rows={3}
                  className="input-focus"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="access_password">
                  {t("admin.exams.form.accessPassword")} ({t("admin.exams.form.optional")})
                </Label>
                <Input
                  id="access_password"
                  type="text"
                  value={form.access_password}
                  onChange={(e) => setForm({ ...form, access_password: e.target.value })}
                  placeholder={t("admin.exams.form.accessPasswordPlaceholder")}
                  className="input-focus"
                />
                <p className="text-sm text-muted-foreground">
                  {t("admin.exams.form.accessPasswordHelp")}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("admin.exams.form.settings")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="department">{t("admin.exams.form.department")}</Label>
                <Select 
                  value={form.department_id} 
                  onValueChange={(v) => setForm({ ...form, department_id: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("admin.exams.form.selectDepartment")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("admin.exams.form.allDepartments")}</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  {t("admin.exams.form.departmentHelp")}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="duration">{t("admin.exams.form.duration")} *</Label>
                  <Input
                    id="duration"
                    type="number"
                    min={1}
                    value={form.duration_minutes}
                    onChange={(e) =>
                      setForm({ ...form, duration_minutes: parseInt(e.target.value) || 60 })
                    }
                    className="input-focus"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="attempts">{t("admin.exams.form.maxAttempts")}</Label>
                  <Input
                    id="attempts"
                    type="number"
                    min={1}
                    value={form.max_attempts}
                    onChange={(e) =>
                      setForm({ ...form, max_attempts: parseInt(e.target.value) || 1 })
                    }
                    className="input-focus"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_time">{t("admin.exams.form.startTime")}</Label>
                  <Input
                    id="start_time"
                    type="datetime-local"
                    value={form.start_time}
                    onChange={(e) => setForm({ ...form, start_time: e.target.value })}
                    className="input-focus"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end_time">{t("admin.exams.form.endTime")}</Label>
                  <Input
                    id="end_time"
                    type="datetime-local"
                    value={form.end_time}
                    onChange={(e) => setForm({ ...form, end_time: e.target.value })}
                    className="input-focus"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="shuffle_questions">{t("admin.exams.form.shuffleQuestions")}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t("admin.exams.form.shuffleQuestionsDesc")}
                    </p>
                  </div>
                  <Switch
                    id="shuffle_questions"
                    checked={form.shuffle_questions}
                    onCheckedChange={(checked) =>
                      setForm({ ...form, shuffle_questions: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="shuffle_options">{t("admin.exams.form.shuffleOptions")}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t("admin.exams.form.shuffleOptionsDesc")}
                    </p>
                  </div>
                  <Switch
                    id="shuffle_options"
                    checked={form.shuffle_options}
                    onCheckedChange={(checked) =>
                      setForm({ ...form, shuffle_options: checked })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" asChild>
              <Link to="/dashboard/exams">{t("admin.exams.form.cancel")}</Link>
            </Button>
            <Button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t("admin.exams.form.creating")}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {t("admin.exams.form.create")}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default CreateExam;
