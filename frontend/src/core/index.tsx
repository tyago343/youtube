import { StrictMode } from "react";
import { RouterProvider } from "./providers/router.provider";
import { StoreProvider } from "./providers/store.provider";
import { GlobalErrorBoundary } from "./error-boundary/GlobalErrorBoundary";
import "./index.css";

export function AppInit() {
  return (
    <StrictMode>
      <GlobalErrorBoundary>
        <StoreProvider>
          <RouterProvider />
        </StoreProvider>
      </GlobalErrorBoundary>
    </StrictMode>
  );
}
