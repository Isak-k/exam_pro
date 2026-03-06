import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Brain, Network, ExternalLink, MessageSquare, Sparkles, Copy, Check, BookOpen, GraduationCap } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Browser } from "@capacitor/browser";
import { Capacitor } from "@capacitor/core";
import { toast } from "sonner";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";

const NOTEBOOK_LM_URL = "https://notebooklm.google.com/";
const MIND_MAP_URL = "https://www.cogniguide.app/mind-maps/mind-map-ai-generator";
const CHATGPT_URL = "https://chatgpt.com/";
const GEMINI_URL = "https://gemini.google.com";

export default function AIStudyAssistant() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);
  const { role } = useAuth();

  const openURL = async (url: string, name: string) => {
    try {
      if (Capacitor.isNativePlatform()) {
        // On Android/iOS: Open in device's default browser
        await Browser.open({
          url: url,
          presentationStyle: "fullscreen",
          toolbarColor: "#0891b2", // Cyan-600 to match app theme
        });
      } else {
        // On Web: Open in new tab
        window.open(url, "_blank");
      }
    } catch (err) {
      console.error(`Error opening ${name}:`, err);
      toast.error(
        t("aiAssistant.error", `Failed to open ${name}`),
        {
          description: t(
            "aiAssistant.errorDescription",
            "Please try again or check your browser settings."
          ),
        }
      );
    }
  };

  const prompts = [
    {
      id: "beg-1",
      level: "beginner",
      title: t("aiAssistant.promptLibrary.prompts.beg1.title", "Explain It Simply"),
      text: t(
        "aiAssistant.promptLibrary.prompts.beg1.text",
        "Explain [topic] in simple terms with a real-world analogy, three key points, and a 3-question self-check quiz with answers."
      ),
    },
    {
      id: "beg-2",
      level: "beginner",
      title: t("aiAssistant.promptLibrary.prompts.beg2.title", "7‑Day Study Plan"),
      text: t(
        "aiAssistant.promptLibrary.prompts.beg2.text",
        "Create a 7-day study plan for [subject]. Each day: 1 goal, 2 resources, 20‑min practice task, and a short recap question."
      ),
    },
    {
      id: "beg-3",
      level: "beginner",
      title: t("aiAssistant.promptLibrary.prompts.beg3.title", "Beginner: Step‑by‑Step Tutor (Full Prompt)"),
      text: t("aiAssistant.promptLibrary.prompts.beg3.text"),
    },
    {
      id: "int-1",
      level: "intermediate",
      title: t("aiAssistant.promptLibrary.prompts.int1.title", "Practice Problems With Steps"),
      text: t(
        "aiAssistant.promptLibrary.prompts.int1.text",
        "Give 5 practice problems on [topic] from easy→hard. Show step-by-step solutions and common mistakes after I try each one."
      ),
    },
    {
      id: "int-2",
      level: "intermediate",
      title: t("aiAssistant.promptLibrary.prompts.int2.title", "Summarize + Check Understanding"),
      text: t(
        "aiAssistant.promptLibrary.prompts.int2.text",
        "Summarize this text in bullet points, then ask me 10 varied questions (MCQ, short answer) and provide answer key with explanations."
      ),
    },
    {
      id: "int-3",
      level: "intermediate",
      title: t("aiAssistant.promptLibrary.prompts.int3.title", "Intermediate: Expert Tutor Guide (Full Prompt)"),
      text: t("aiAssistant.promptLibrary.prompts.int3.text"),
    },
    {
      id: "mas-1",
      level: "mastery",
      title: t("aiAssistant.promptLibrary.prompts.mas1.title", "Socratic Drill"),
      text: t(
        "aiAssistant.promptLibrary.prompts.mas1.text",
        "Act as a tutor. Ask me probing questions on [topic], escalating complexity. Only reveal hints when I ask. Give feedback on reasoning."
      ),
    },
    {
      id: "mas-2",
      level: "mastery",
      title: t("aiAssistant.promptLibrary.prompts.mas2.title", "Exam‑Style Set With Rubric"),
      text: t(
        "aiAssistant.promptLibrary.prompts.mas2.text",
        "Create 12 mixed questions for [course]: 6 MCQ, 4 short answer, 2 case studies. Include difficulty tags and a grading rubric with model answers."
      ),
    },
    {
      id: "mas-3",
      level: "mastery",
      title: t("aiAssistant.promptLibrary.prompts.mas3.title", "Mastery: Professor‑Level Mentor (Full Prompt)"),
      text: t("aiAssistant.promptLibrary.prompts.mas3.text"),
    },
    ...(role === "admin"
      ? [
          {
            id: "admin-mcq",
            level: "admin",
            title: t(
              "aiAssistant.promptLibrary.prompts.adminMcq.title",
              "MCQ Generator Prompt (For Admins)"
            ),
            text: t(
              "aiAssistant.promptLibrary.prompts.adminMcq.text",
              `🧠 MCQ Generator Prompt (For Admins)
Act as an expert exam question generator.

I want to generate multiple-choice questions for exams.

Topic:
[Enter the topic here]

Difficulty level:
[Easy / Medium / Hard]

Number of questions:
[Enter number]

Instructions:
1. Generate high-quality multiple-choice questions based on the topic.
2. Each question must have 4 choices (A, B, C, D).
3. Mark the correct answer using * at the end of the correct option.
4. After each question, provide a short explanation of the correct answer.
5. Use clear and simple English.
6. Avoid repeating questions.
7. Make questions suitable for students.

Format the output exactly like this:

1. Question here?
A. Choice
B. Choice
C. Correct answer *
D. Choice

Explanation: Write a best and clear explanation of why the answer is correct.`
            ),
          } as const,
        ]
      : []),
  ] as const;

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedPrompt(id);
      toast.success(t("common.copied", "Copied to clipboard"));
      setTimeout(() => setCopiedPrompt(null), 2000);
    } catch {
      toast.error(t("common.copy_failed", "Copy failed. Please try again."));
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl lg:text-3xl font-display font-bold">
              {t("aiAssistant.title", "AI Study Assistant")}
            </h1>
            <p className="text-muted-foreground mt-1">
              {t("aiAssistant.subtitle", "Choose your AI-powered study tool")}
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {/* NotebookLM Card */}
          <Card 
            className="group relative overflow-hidden cursor-pointer transition-all hover:shadow-2xl hover:scale-[1.02]"
            onClick={() => openURL(NOTEBOOK_LM_URL, "NotebookLM")}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 opacity-90 group-hover:opacity-100 transition-opacity" />
            <div className="relative p-6 space-y-4">
              <div className="h-16 w-16 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-display font-bold text-white mb-2">
                  Google NotebookLM
                </h3>
                <p className="text-white/90 text-sm leading-relaxed">
                  {t("aiAssistant.notebookDescription", "Get AI-powered help with your studies. Upload documents, ask questions, and get instant answers.")}
                </p>
              </div>
              <div className="flex items-center gap-2 text-white/80 group-hover:text-white transition-colors pt-2">
                <ExternalLink className="h-4 w-4" />
                <span className="text-sm font-medium">{t("common.launch", "Launch")}</span>
              </div>
            </div>
          </Card>

          {/* Mind Map Generator Card */}
          <Card 
            className="group relative overflow-hidden cursor-pointer transition-all hover:shadow-2xl hover:scale-[1.02]"
            onClick={() => openURL(MIND_MAP_URL, "Mind Map Generator")}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-500 opacity-90 group-hover:opacity-100 transition-opacity" />
            <div className="relative p-6 space-y-4">
              <div className="h-16 w-16 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                <Network className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-display font-bold text-white mb-2">
                  Mind Map Generator
                </h3>
                <p className="text-white/90 text-sm leading-relaxed">
                  {t("mindMap.description", "Create AI-powered mind maps to visualize and organize your study materials.")}
                </p>
              </div>
              <div className="flex items-center gap-2 text-white/80 group-hover:text-white transition-colors pt-2">
                <ExternalLink className="h-4 w-4" />
                <span className="text-sm font-medium">{t("common.launch", "Launch")}</span>
              </div>
            </div>
          </Card>

          {/* ChatGPT Card */}
          <Card 
            className="group relative overflow-hidden cursor-pointer transition-all hover:shadow-2xl hover:scale-[1.02]"
            onClick={() => openURL(CHATGPT_URL, "ChatGPT")}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 opacity-90 group-hover:opacity-100 transition-opacity" />
            <div className="relative p-6 space-y-4">
              <div className="h-16 w-16 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageSquare className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-display font-bold text-white mb-2">
                  ChatGPT
                </h3>
                <p className="text-white/90 text-sm leading-relaxed">
                  {t("chatgpt.description", "Chat with AI to get explanations, solve problems, and learn new concepts interactively.")}
                </p>
              </div>
              <div className="flex items-center gap-2 text-white/80 group-hover:text-white transition-colors pt-2">
                <ExternalLink className="h-4 w-4" />
                <span className="text-sm font-medium">{t("common.launch", "Launch")}</span>
              </div>
            </div>
          </Card>

          {/* Gemini Card */}
          <Card 
            className="group relative overflow-hidden cursor-pointer transition-all hover:shadow-2xl hover:scale-[1.02]"
            onClick={() => openURL(GEMINI_URL, "Gemini")}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 opacity-90 group-hover:opacity-100 transition-opacity" />
            <div className="relative p-6 space-y-4">
              <div className="h-16 w-16 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-display font-bold text-white mb-2">
                  Google Gemini
                </h3>
                <p className="text-white/90 text-sm leading-relaxed">
                  {t("gemini.description", "Google's advanced AI assistant for research, writing, and creative problem-solving.")}
                </p>
              </div>
              <div className="flex items-center gap-2 text-white/80 group-hover:text-white transition-colors pt-2">
                <ExternalLink className="h-4 w-4" />
                <span className="text-sm font-medium">{t("common.launch", "Launch")}</span>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-display font-semibold">
                {t("aiAssistant.promptLibrary.title", "Prompt Library")}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t(
                  "aiAssistant.promptLibrary.subtitle",
                  "Copy ready-made prompts for Beginners, Intermediate and Mastery levels."
                )}
              </p>
            </div>
          </div>
          <Tabs defaultValue="beginner">
            <TabsList>
              <TabsTrigger value="beginner">
                <GraduationCap className="mr-2 h-4 w-4" />
                {t("aiAssistant.promptLibrary.beginner", "Beginner")}
              </TabsTrigger>
              <TabsTrigger value="intermediate">
                {t("aiAssistant.promptLibrary.intermediate", "Intermediate")}
              </TabsTrigger>
              <TabsTrigger value="mastery">
                {t("aiAssistant.promptLibrary.mastery", "Mastery")}
              </TabsTrigger>
              {role === "admin" && (
                <TabsTrigger value="admin">
                  {t("aiAssistant.promptLibrary.admin", "Admin")}
                </TabsTrigger>
              )}
            </TabsList>
            <TabsContent value="beginner" className="mt-4 space-y-3">
              {prompts
                .filter((p) => p.level === "beginner")
                .map((p) => (
                  <div
                    key={p.id}
                    className="flex items-start justify-between rounded-lg border bg-card p-4"
                  >
                    <div className="pr-4">
                      <p className="font-medium">{p.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground whitespace-pre-wrap">{p.text}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy(p.text, p.id)}
                      className="shrink-0"
                    >
                      {copiedPrompt === p.id ? (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          {t("common.copied", "Copied")}
                        </>
                      ) : (
                        <>
                          <Copy className="mr-2 h-4 w-4" />
                          {t("common.copy", "Copy")}
                        </>
                      )}
                    </Button>
                  </div>
                ))}
            </TabsContent>
            <TabsContent value="intermediate" className="mt-4 space-y-3">
              {prompts
                .filter((p) => p.level === "intermediate")
                .map((p) => (
                  <div
                    key={p.id}
                    className="flex items-start justify-between rounded-lg border bg-card p-4"
                  >
                    <div className="pr-4">
                      <p className="font-medium">{p.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground whitespace-pre-wrap">{p.text}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy(p.text, p.id)}
                      className="shrink-0"
                    >
                      {copiedPrompt === p.id ? (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          {t("common.copied", "Copied")}
                        </>
                      ) : (
                        <>
                          <Copy className="mr-2 h-4 w-4" />
                          {t("common.copy", "Copy")}
                        </>
                      )}
                    </Button>
                  </div>
                ))}
            </TabsContent>
            <TabsContent value="mastery" className="mt-4 space-y-3">
              {prompts
                .filter((p) => p.level === "mastery")
                .map((p) => (
                  <div
                    key={p.id}
                    className="flex items-start justify-between rounded-lg border bg-card p-4"
                  >
                    <div className="pr-4">
                      <p className="font-medium">{p.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground whitespace-pre-wrap">{p.text}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy(p.text, p.id)}
                      className="shrink-0"
                    >
                      {copiedPrompt === p.id ? (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          {t("common.copied", "Copied")}
                        </>
                      ) : (
                        <>
                          <Copy className="mr-2 h-4 w-4" />
                          {t("common.copy", "Copy")}
                        </>
                      )}
                    </Button>
                  </div>
                ))}
            </TabsContent>
            {role === "admin" && (
              <TabsContent value="admin" className="mt-4 space-y-3">
                {prompts
                  .filter((p) => p.level === "admin")
                  .map((p) => (
                    <div
                      key={p.id}
                      className="flex items-start justify-between rounded-lg border bg-card p-4"
                    >
                      <div className="pr-4">
                        <p className="font-medium">{p.title}</p>
                        <p className="mt-1 text-sm text-muted-foreground whitespace-pre-wrap">{p.text}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopy(p.text, p.id)}
                        className="shrink-0"
                      >
                        {copiedPrompt === p.id ? (
                          <>
                            <Check className="mr-2 h-4 w-4" />
                            {t("common.copied", "Copied")}
                          </>
                        ) : (
                          <>
                            <Copy className="mr-2 h-4 w-4" />
                            {t("common.copy", "Copy")}
                          </>
                        )}
                      </Button>
                    </div>
                  ))}
              </TabsContent>
            )}
          </Tabs>
        </Card>

        <Card className="p-4 bg-muted/50">
          <div className="flex items-start gap-3">
            <Brain className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div className="text-sm text-muted-foreground space-y-2">
              <p>
                {t(
                  "aiAssistant.note",
                  "Note: These tools open in your browser. You may need to sign in with your Google account for NotebookLM."
                )}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
