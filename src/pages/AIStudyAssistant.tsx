import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Browser } from "@capacitor/browser";
import { Capacitor } from "@capacitor/core";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const NOTEBOOK_LM_URL = "https://notebooklm.google.com/";

export default function AIStudyAssistant() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    openNotebookLM();
  }, []);

  const openNotebookLM = async () => {
    try {
      if (Capacitor.isNativePlatform()) {
        // On Android/iOS: Open in device's default browser
        await Browser.open({
          url: NOTEBOOK_LM_URL,
          presentationStyle: "fullscreen",
          toolbarColor: "#0891b2", // Cyan-600 to match app theme
        });
      } else {
        // On Web: Open in new tab
        window.open(NOTEBOOK_LM_URL, "_blank");
      }
      
      // Navigate back to dashboard after opening
      navigate("/dashboard");
    } catch (err) {
      console.error("Error opening NotebookLM:", err);
      toast.error(
        t("aiAssistant.error", "Failed to open AI Study Assistant"),
        {
          description: t(
            "aiAssistant.errorDescription",
            "Please try again or check your browser settings."
          ),
        }
      );
      navigate("/dashboard");
    }
  };

  // Show nothing while redirecting
  return null;
}
