import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Brain, Network, ExternalLink, MessageSquare, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Browser } from "@capacitor/browser";
import { Capacitor } from "@capacitor/core";
import { toast } from "sonner";

const NOTEBOOK_LM_URL = "https://notebooklm.google.com/";
const MIND_MAP_URL = "https://www.cogniguide.app/mind-maps/mind-map-ai-generator";
const CHATGPT_URL = "https://chatgpt.com/";
const GEMINI_URL = "https://gemini.google.com/app";

export default function AIStudyAssistant() {
  const navigate = useNavigate();
  const { t } = useTranslation();

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
