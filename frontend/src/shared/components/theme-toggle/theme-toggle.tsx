import { useTranslation } from "react-i18next";
import { useTheme } from "@core/theme/hooks/use-theme";
import { Moon, Sun } from "lucide-react";
import Button from "@shared/ui/button/button";

export function ThemeToggle() {
  const { t } = useTranslation("shared");
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const label = isDark ? t("theme.switchToLight") : t("theme.switchToDark");

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}
