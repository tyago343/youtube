import { useEffect, useState } from "react";
import {
  getStoredThemePreference,
  saveThemePreference,
} from "@shared/lib/storage";

export type ThemeId = "light" | "dark";

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeId>(() => {
    const stored = getStoredThemePreference();
    if (stored === "light" || stored === "dark") {
      return stored;
    }

    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }

    return "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    saveThemePreference(theme);
  }, [theme]);

  const setTheme = (newTheme: ThemeId) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return { theme, setTheme, toggleTheme };
}
