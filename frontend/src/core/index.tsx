import { StrictMode } from "react";
import { RouterProvider } from "./providers/router.provider";
import { StoreProvider } from "./providers/store.provider";
import { GlobalErrorBoundary } from "./error-boundary/global-error.boundary.";
import { initTheme } from "./theme/init-theme";
import "./index.css";
import { Toaster } from "sonner";
import { I18nProvider } from "./providers/i18n.provider";

export function AppInit() {
  initTheme();
  return (
    <StrictMode>
      <I18nProvider>
        <GlobalErrorBoundary>
          <StoreProvider>
            <Toaster richColors position="top-right" duration={3000} />
            <RouterProvider />
          </StoreProvider>
        </GlobalErrorBoundary>
      </I18nProvider>
    </StrictMode>
  );
}
