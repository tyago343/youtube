import { Component } from "react";
import { ErrorFallback } from "./ErrorFallback";
import { getErrorMessage } from "./error-messages.config";
import type {
  ErrorBoundaryProps,
  ErrorBoundaryState,
  ErrorContext,
} from "./types";

interface Props extends ErrorBoundaryProps {
  context: ErrorContext;
}

export class ErrorBoundary extends Component<Props, ErrorBoundaryState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error("Error Boundary caught error:", {
        error,
        errorInfo,
        context: this.props.context,
        route: window.location.pathname,
      });
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });

    if (this.props.config?.onReset) {
      this.props.config.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const context = this.props.context;
      const customConfig = this.props.config
        ? {
            title: this.props.config.fallbackTitle,
            message: this.props.config.fallbackMessage,
            actions: {
              reload: this.props.config.showReloadButton,
              back: this.props.config.showBackButton,
            },
          }
        : undefined;

      const messageConfig = getErrorMessage(context, customConfig);

      return (
        <ErrorFallback config={messageConfig} onReset={this.handleReset} />
      );
    }

    return this.props.children;
  }
}
