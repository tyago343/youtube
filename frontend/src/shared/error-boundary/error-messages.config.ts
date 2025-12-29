import type { ErrorContext } from "./types";

export interface ErrorMessageConfig {
  title: string;
  message: string;
  actions: {
    reload?: boolean;
    back?: boolean;
    retry?: boolean;
  };
}

export const ERROR_MESSAGES: Record<ErrorContext, ErrorMessageConfig> = {
  global: {
    title: "Something went wrong",
    message:
      "An unexpected error occurred. Please reload the page to continue.",
    actions: {
      reload: true,
    },
  },
  route: {
    title: "Error loading the page",
    message:
      "We couldn't load this section. Please try reloading the application or visit another page.",
    actions: {
      reload: true,
    },
  },
  auth: {
    title: "Authentication error",
    message:
      "There was a problem processing your authentication request. Please try again.",
    actions: {
      retry: true,
    },
  },
  video: {
    title: "Error loading the video",
    message:
      "We couldn't load the player or the video information. Please try again or go back to the previous page.",
    actions: {
      retry: true,
      back: true,
    },
  },
  user: {
    title: "Error loading the profile",
    message:
      "We couldn't load your user information. Please try reloading the page or going back to the home page.",
    actions: {
      reload: true,
      back: true,
    },
  },
  search: {
    title: "Error searching",
    message:
      "We couldn't perform the search. Please try again or go back to the previous page.",
    actions: {
      retry: true,
      back: true,
    },
  },
};

export function getErrorMessage(
  context: ErrorContext,
  customConfig?: Partial<ErrorMessageConfig>
): ErrorMessageConfig {
  const defaultConfig = ERROR_MESSAGES[context];
  return {
    ...defaultConfig,
    ...customConfig,
    actions: {
      ...defaultConfig.actions,
      ...customConfig?.actions,
    },
  };
}
