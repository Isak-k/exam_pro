import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Download, Share } from "lucide-react";
import { useTranslation } from "react-i18next";

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    // Check if it's iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    // Check if it's not in standalone mode (not already installed)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone;
    
    if (isIOSDevice && !isStandalone) {
      setIsIOS(true);
      // Show prompt after a delay on iOS
      const timer = setTimeout(() => setIsVisible(true), 3000);
      return () => clearTimeout(timer);
    }

    const handler = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update UI notify the user they can install the PWA
      setIsVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  if (isIOS) {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-50 animate-in slide-in-from-bottom-10 fade-in duration-500">
        <div className="bg-primary text-primary-foreground p-4 rounded-xl shadow-lg flex flex-col gap-4 max-w-md mx-auto">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Share className="h-5 w-5" />
              </div>
              <div className="text-sm">
                <p className="font-semibold">{t("common.install.ios.title")}</p>
                <p className="opacity-90 text-xs">{t("common.install.desc")}</p>
              </div>
            </div>
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-8 w-8 hover:bg-white/20 text-primary-foreground -mt-1 -mr-1"
              onClick={() => setIsVisible(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-sm bg-white/10 p-3 rounded-lg space-y-2">
            <div className="flex items-center gap-2">
              <Share className="h-4 w-4" />
              <span>1. {t("common.install.ios.step1")}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg leading-none">+</span>
              <span>2. {t("common.install.ios.step2")}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-in slide-in-from-bottom-10 fade-in duration-500">
      <div className="bg-primary text-primary-foreground p-4 rounded-xl shadow-lg flex items-center justify-between gap-4 max-w-md mx-auto">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <Download className="h-5 w-5" />
          </div>
          <div className="text-sm">
            <p className="font-semibold">{t("common.install.title")}</p>
            <p className="opacity-90 text-xs">{t("common.install.desc")}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            variant="secondary" 
            onClick={handleInstallClick}
            className="whitespace-nowrap"
          >
            {t("common.install.button")}
          </Button>
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8 hover:bg-white/20 text-primary-foreground"
            onClick={() => setIsVisible(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
