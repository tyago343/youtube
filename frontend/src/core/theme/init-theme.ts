import { getStoredThemePreference } from "@shared/lib/storage";

export function initTheme(): void {
  if (typeof window === "undefined") {
    return;
  }

  const stored = getStoredThemePreference();
  let theme: "light" | "dark" = "dark";

  if (stored === "light" || stored === "dark") {
    theme = stored;
  } else {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    theme = prefersDark ? "dark" : "light";
  }

  document.documentElement.setAttribute("data-theme", theme);
}
