import { Badge } from "@/components/ui/badge";
import { Keyboard } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslation } from "react-i18next";

export function KeyboardShortcutsHelp() {
  const { t } = useTranslation();
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge variant="outline" className="cursor-help gap-1.5 text-muted-foreground">
          <Keyboard className="h-3 w-3" />
          {t("student.exam.shortcuts.trigger")}
        </Badge>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="w-64">
        <div className="space-y-2 text-sm">
          <p className="font-medium mb-2">{t("student.exam.shortcuts.title")}</p>
          <div className="grid grid-cols-2 gap-1 text-xs">
            <span className="text-muted-foreground">{t("student.exam.shortcuts.next")}</span>
            <span><kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">→</kbd> or <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">N</kbd></span>
            
            <span className="text-muted-foreground">{t("student.exam.shortcuts.prev")}</span>
            <span><kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">←</kbd> or <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">P</kbd></span>
            
            <span className="text-muted-foreground">{t("student.exam.shortcuts.select")}</span>
            <span><kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">1-6</kbd></span>
            
            <span className="text-muted-foreground">{t("student.exam.shortcuts.submit")}</span>
            <span><kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Ctrl+Enter</kbd></span>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
