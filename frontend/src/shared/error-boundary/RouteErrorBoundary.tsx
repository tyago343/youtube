import type { ReactNode } from "react";
import { ErrorBoundary } from "./ErrorBoundary";
import type { ErrorContext, ErrorBoundaryConfig } from "./types";

interface RouteErrorBoundaryProps {
  children: ReactNode;
  context: ErrorContext;
  config?: Partial<ErrorBoundaryConfig>;
}

export function RouteErrorBoundary({
  children,
  context,
  config,
}: RouteErrorBoundaryProps) {
  return (
    <ErrorBoundary context={context} config={config}>
      {children}
    </ErrorBoundary>
  );
}
