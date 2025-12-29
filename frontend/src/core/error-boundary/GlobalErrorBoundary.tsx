import type { ReactNode } from "react";
import { ErrorBoundary } from "@/shared/error-boundary/ErrorBoundary";
import type { ErrorBoundaryConfig } from "@/shared/error-boundary/types";

interface GlobalErrorBoundaryProps {
  children: ReactNode;
  config?: Partial<ErrorBoundaryConfig>;
}

export function GlobalErrorBoundary({
  children,
  config,
}: GlobalErrorBoundaryProps) {
  return (
    <ErrorBoundary context="global" config={config}>
      {children}
    </ErrorBoundary>
  );
}
