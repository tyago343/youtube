import { useTranslation } from "react-i18next";
import { AlertCircle, RefreshCw, ArrowLeft, RotateCcw } from "lucide-react";
import Button from "@shared/ui/button/button";
import type { ErrorMessageConfig } from "./error-messages.config";

interface ErrorFallbackProps {
  config: ErrorMessageConfig;
  onReset?: () => void;
  onReload?: () => void;
  onBack?: () => void;
}

export function ErrorFallback({
  config,
  onReset,
  onReload,
  onBack,
}: ErrorFallbackProps) {
  const { t } = useTranslation("shared");

  const handleReload = () => {
    if (onReload) {
      onReload();
    } else {
      window.location.reload();
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
  };

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center p-8">
      <div className="flex max-w-md flex-col items-center gap-6 text-center">
        <div className="rounded-full bg-destructive/10 p-4">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">{t(config.titleKey)}</h2>
          <p className="text-muted-foreground">{t(config.messageKey)}</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {config.actions.reload && (
            <Button onClick={handleReload} variant="default">
              <RefreshCw className="mr-2 h-4 w-4" />
              {t("actions.reloadPage")}
            </Button>
          )}

          {config.actions.back && (
            <Button onClick={handleBack} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("actions.goBack")}
            </Button>
          )}

          {config.actions.retry && onReset && (
            <Button onClick={onReset} variant="outline">
              <RotateCcw className="mr-2 h-4 w-4" />
              {t("actions.tryAgain")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
