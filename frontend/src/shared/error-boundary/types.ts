import type { ReactNode } from "react";

export type ErrorContext =
  | "global"
  | "route"
  | "auth"
  | "video"
  | "user"
  | "search";

export interface ErrorBoundaryConfig {
  context: ErrorContext;
  fallbackTitle?: string;
  fallbackMessage?: string;
  showReloadButton?: boolean;
  showBackButton?: boolean;
  onReset?: () => void;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export interface ErrorBoundaryProps {
  children: ReactNode;
  config?: Partial<ErrorBoundaryConfig>;
  fallback?: ReactNode;
}
