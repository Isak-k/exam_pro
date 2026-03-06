import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Brain, Network, ExternalLink, MessageSquare, Sparkles, Copy, Check, BookOpen, GraduationCap, FileQuestion } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Browser } from "@capacitor/browser";
import { Capacitor } from "@capacitor/core";
import { toast } from "sonner";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";

const NOTEBOOK_LM_URL = "https://notebooklm.google.com/";
const MIND_MAP_URL = "https://www.cogniguide.app/mind-maps/mind-map-ai-generator";
const CHATGPT_URL = "https://chatgpt.com/";
const GEMINI_URL = "https://gemini.google.com";

interface Prompt {
  id: string;
  titleKey: string;
  descriptionKey: string;
  promptKey: string;
  level: "beginner" | "intermediate" | "advanced";
  category: string;
}

const PROMPTS: Prompt[] = [
  // Beginner Prompts
  {
    id: "b1",
    titleKey: "aiAssistant.prompts.b1.title",
    descriptionKey: "aiAssistant.prompts.b1.description",
    promptKey: "aiAssistant.prompts.b1.prompt",
    level: "beginner",
    category: "Interactive Learning"
  },
  {
    id: "b2",
    titleKey: "aiAssistant.prompts.b2.title",
    descriptionKey: "aiAssistant.prompts.b2.description",
    promptKey: "aiAssistant.prompts.b2.prompt",
    level: "beginner",
    category: "Learning"
  },
  {
    id: "b3",
    titleKey: "aiAssistant.prompts.b3.title",
    descriptionKey: "aiAssistant.prompts.b3.description",
    promptKey: "aiAssistant.prompts.b3.prompt",
    level: "beginner",
    category: "Study"
  },
  {
    id: "b4",
    titleKey: "aiAssistant.prompts.b4.title",
    descriptionKey: "aiAssistant.prompts.b4.description",
    promptKey: "aiAssistant.prompts.b4.prompt",
    level: "beginner",
    category: "Homework"
  },
  {
    id: "b5",
    titleKey: "aiAssistant.prompts.b5.title",
    descriptionKey: "aiAssistant.prompts.b5.description",
    promptKey: "aiAssistant.prompts.b5.prompt",
    level: "beginner",
    category: "Language"
  },
  
  // Intermediate Prompts
  {
    id: "i1",
    titleKey: "aiAssistant.prompts.i1.title",
    descriptionKey: "aiAssistant.prompts.i1.description",
    promptKey: "aiAssistant.prompts.i1.prompt",
    level: "intermediate",
    category: "Interactive Learning"
  },
  {
    id: "i2",
    titleKey: "aiAssistant.prompts.i2.title",
    descriptionKey: "aiAssistant.prompts.i2.description",
    promptKey: "aiAssistant.prompts.i2.prompt",
    level: "intermediate",
    category: "Writing"
  },
  {
    id: "i3",
    titleKey: "aiAssistant.prompts.i3.title",
    descriptionKey: "aiAssistant.prompts.i3.description",
    promptKey: "aiAssistant.prompts.i3.prompt",
    level: "intermediate",
    category: "Learning"
  },
  {
    id: "i4",
    titleKey: "aiAssistant.prompts.i4.title",
    descriptionKey: "aiAssistant.prompts.i4.description",
    promptKey: "aiAssistant.prompts.i4.prompt",
    level: "intermediate",
    category: "Practice"
  },
  {
    id: "i5",
    titleKey: "aiAssistant.prompts.i5.title",
    descriptionKey: "aiAssistant.prompts.i5.description",
    promptKey: "aiAssistant.prompts.i5.prompt",
    level: "intermediate",
    category: "Research"
  },
  
  // Advanced Prompts
  {
    id: "a1",
    titleKey: "aiAssistant.prompts.a1.title",
    descriptionKey: "aiAssistant.prompts.a1.description",
    promptKey: "aiAssistant.prompts.a1.prompt",
    level: "advanced",
    category: "Interactive Learning"
  },
  {
    id: "a2",
    titleKey: "aiAssistant.prompts.a2.title",
    descriptionKey: "aiAssistant.prompts.a2.description",
    promptKey: "aiAssistant.prompts.a2.prompt",
    level: "advanced",
    category: "Analysis"
  },
  {
    id: "a3",
    titleKey: "aiAssistant.prompts.a3.title",
    descriptionKey: "aiAssistant.prompts.a3.description",
    promptKey: "aiAssistant.prompts.a3.prompt",
    level: "advanced",
    category: "Critical Thinking"
  },
  {
    id: "a4",
    titleKey: "aiAssistant.prompts.a4.title",
    descriptionKey: "aiAssistant.prompts.a4.description",
    promptKey: "aiAssistant.prompts.a4.prompt",
    level: "advanced",
    category: "Writing"
  },
  
  // Admin Only Prompts
  {
    id: "admin1",
    titleKey: "aiAssistant.prompts.admin1.title",
    descriptionKey: "aiAssistant.prompts.admin1.description",
    promptKey: "aiAssistant.prompts.admin1.prompt",
    level: "advanced",
    category: "Admin Tools"
  }
];
export default function AIStudyAssistant() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { role } = useAuth();
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);
  
  const isAdmin = role === "admin";

  const openURL = async (url: string, name: string) => {
    try {
      if (Capacitor.isNativePlatform()) {
        await Browser.open({
          url: url,
          presentationStyle: "fullscreen",
          toolbarColor: "#0891b2",
        });
      } else {
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

  const copyPrompt = (promptKey: string, id: string) => {
    const promptText = t(promptKey);
    navigator.clipboard.writeText(promptText);
    setCopiedPrompt(id);
    toast.success("Prompt copied!", {
      description: "Paste it into any AI tool to use it.",
    });
    setTimeout(() => setCopiedPrompt(null), 2000);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "intermediate":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "advanced":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "beginner":
        return <BookOpen className="h-4 w-4" />;
      case "intermediate":
        return <GraduationCap className="h-4 w-4" />;
      case "advanced":
        return <Brain className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
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
              {t("aiAssistant.subtitle", "AI tools and ready-to-use prompts for effective studying")}
            </p>
          </div>
        </div>

        <Tabs defaultValue="tools" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tools" className="gap-2">
              <Sparkles className="h-4 w-4" />
              <span>AI Tools</span>
            </TabsTrigger>
            <TabsTrigger value="prompts" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              <span>Prompt Library</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tools" className="space-y-6 mt-6">
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
              {/* NotebookLM Card */}
              <Card 
                className="group relative overflow-hidden cursor-pointer transition-all hover:shadow-xl hover:scale-[1.02]"
                onClick={() => openURL(NOTEBOOK_LM_URL, "NotebookLM")}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 opacity-90 group-hover:opacity-100 transition-opacity" />
                <div className="relative p-4 sm:p-6 space-y-3 sm:space-y-4">
                  <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Brain className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-display font-bold text-white mb-1 sm:mb-2">
                      Google NotebookLM
                    </h3>
                    <p className="text-white/90 text-xs sm:text-sm leading-relaxed">
                      {t("aiAssistant.notebookDescription", "Upload documents, ask questions, and get instant answers.")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-white/80 group-hover:text-white transition-colors pt-2">
                    <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="text-xs sm:text-sm font-medium">{t("common.launch", "Launch")}</span>
                  </div>
                </div>
              </Card>

              {/* Mind Map Generator Card */}
              <Card 
                className="group relative overflow-hidden cursor-pointer transition-all hover:shadow-xl hover:scale-[1.02]"
                onClick={() => openURL(MIND_MAP_URL, "Mind Map Generator")}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-500 opacity-90 group-hover:opacity-100 transition-opacity" />
                <div className="relative p-4 sm:p-6 space-y-3 sm:space-y-4">
                  <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Network className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-display font-bold text-white mb-1 sm:mb-2">
                      Mind Map Generator
                    </h3>
                    <p className="text-white/90 text-xs sm:text-sm leading-relaxed">
                      {t("mindMap.description", "Create visual mind maps to organize study materials.")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-white/80 group-hover:text-white transition-colors pt-2">
                    <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="text-xs sm:text-sm font-medium">{t("common.launch", "Launch")}</span>
                  </div>
                </div>
              </Card>

              {/* ChatGPT Card */}
              <Card 
                className="group relative overflow-hidden cursor-pointer transition-all hover:shadow-xl hover:scale-[1.02]"
                onClick={() => openURL(CHATGPT_URL, "ChatGPT")}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 opacity-90 group-hover:opacity-100 transition-opacity" />
                <div className="relative p-4 sm:p-6 space-y-3 sm:space-y-4">
                  <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MessageSquare className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-display font-bold text-white mb-1 sm:mb-2">
                      ChatGPT
                    </h3>
                    <p className="text-white/90 text-xs sm:text-sm leading-relaxed">
                      {t("chatgpt.description", "Chat with AI to solve problems and learn interactively.")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-white/80 group-hover:text-white transition-colors pt-2">
                    <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="text-xs sm:text-sm font-medium">{t("common.launch", "Launch")}</span>
                  </div>
                </div>
              </Card>

              {/* Gemini Card */}
              <Card 
                className="group relative overflow-hidden cursor-pointer transition-all hover:shadow-xl hover:scale-[1.02]"
                onClick={() => openURL(GEMINI_URL, "Gemini")}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 opacity-90 group-hover:opacity-100 transition-opacity" />
                <div className="relative p-4 sm:p-6 space-y-3 sm:space-y-4">
                  <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-display font-bold text-white mb-1 sm:mb-2">
                      Google Gemini
                    </h3>
                    <p className="text-white/90 text-xs sm:text-sm leading-relaxed">
                      {t("gemini.description", "Advanced AI for research and creative problem-solving.")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-white/80 group-hover:text-white transition-colors pt-2">
                    <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="text-xs sm:text-sm font-medium">{t("common.launch", "Launch")}</span>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="prompts" className="space-y-4 mt-6">
            <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900 dark:text-blue-100">
                  <p className="font-medium mb-1">How to use these prompts:</p>
                  <ol className="list-decimal list-inside space-y-1 text-xs sm:text-sm">
                    <li>Click "Copy" on any prompt below</li>
                    <li>Open any AI tool (ChatGPT, Gemini, NotebookLM)</li>
                    <li>Paste the prompt and replace [TOPIC] with your subject</li>
                    <li>Get personalized study help!</li>
                  </ol>
                </div>
              </div>
            </Card>

            <Tabs defaultValue="beginner" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="beginner" className="text-xs sm:text-sm">
                  <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  Beginner
                </TabsTrigger>
                <TabsTrigger value="intermediate" className="text-xs sm:text-sm">
                  <GraduationCap className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  Intermediate
                </TabsTrigger>
                <TabsTrigger value="advanced" className="text-xs sm:text-sm">
                  <Brain className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  Advanced
                </TabsTrigger>
              </TabsList>

              {["beginner", "intermediate", "advanced"].map((level) => (
                <TabsContent key={level} value={level} className="space-y-3 sm:space-y-4 mt-4">
                  {PROMPTS.filter((p) => {
                    // Filter by level
                    if (p.level !== level) return false;
                    // Hide admin-only prompts from students
                    if (p.id.startsWith("admin") && !isAdmin) return false;
                    return true;
                  }).map((prompt) => (
                    <Card key={prompt.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(prompt.level)}`}>
                                {getLevelIcon(prompt.level)}
                                {prompt.level.charAt(0).toUpperCase() + prompt.level.slice(1)}
                              </span>
                              <span className="text-xs text-muted-foreground">{prompt.category}</span>
                              {prompt.id.startsWith("admin") && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                                  <FileQuestion className="h-3 w-3" />
                                  Admin Only
                                </span>
                              )}
                            </div>
                            <h3 className="font-semibold text-base sm:text-lg mb-1">{t(prompt.titleKey)}</h3>
                            <p className="text-xs sm:text-sm text-muted-foreground">{t(prompt.descriptionKey)}</p>
                          </div>
                          <Button
                            size="sm"
                            variant={copiedPrompt === prompt.id ? "default" : "outline"}
                            onClick={() => copyPrompt(prompt.promptKey, prompt.id)}
                            className="shrink-0"
                          >
                            {copiedPrompt === prompt.id ? (
                              <>
                                <Check className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                                <span className="hidden sm:inline">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                                <span className="hidden sm:inline">Copy</span>
                              </>
                            )}
                          </Button>
                        </div>
                        <ScrollArea className="w-full">
                          <div className="bg-muted/50 rounded-lg p-3 sm:p-4">
                            <pre className="text-xs sm:text-sm whitespace-pre-wrap font-mono break-words">
                              {t(prompt.promptKey)}
                            </pre>
                          </div>
                        </ScrollArea>
                      </div>
                    </Card>
                  ))}
                </TabsContent>
              ))}
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
