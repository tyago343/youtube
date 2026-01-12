import type { ErrorContext } from "./types";

export interface ErrorMessageConfig {
  titleKey: string;
  messageKey: string;
  actions: {
    reload?: boolean;
    back?: boolean;
    retry?: boolean;
  };
}

export const ERROR_MESSAGES: Record<ErrorContext, ErrorMessageConfig> = {
  global: {
    titleKey: "errors.global.title",
    messageKey: "errors.global.message",
    actions: {
      reload: true,
    },
  },
  route: {
    titleKey: "errors.route.title",
    messageKey: "errors.route.message",
    actions: {
      reload: true,
    },
  },
  auth: {
    titleKey: "errors.auth.title",
    messageKey: "errors.auth.message",
    actions: {
      retry: true,
    },
  },
  video: {
    titleKey: "errors.video.title",
    messageKey: "errors.video.message",
    actions: {
      retry: true,
      back: true,
    },
  },
  user: {
    titleKey: "errors.user.title",
    messageKey: "errors.user.message",
    actions: {
      reload: true,
      back: true,
    },
  },
  search: {
    titleKey: "errors.search.title",
    messageKey: "errors.search.message",
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
