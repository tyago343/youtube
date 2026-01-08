import { vi } from "vitest";

/**
 * Suppresses expected errors in tests by intercepting console.error and console.warn.
 * Use this when testing error handling scenarios where errors are expected and handled.
 *
 * @example
 * ```ts
 * it('should handle errors gracefully', () => {
 *   const restore = suppressExpectedErrors();
 *   // ... test code that produces expected errors ...
 *   restore();
 * });
 * ```
 */
export function suppressExpectedErrors() {
  const originalError = console.error;
  const originalWarn = console.warn;

  // Suppress console.error and console.warn
  console.error = vi.fn();
  console.warn = vi.fn();

  // Return restore function
  return () => {
    console.error = originalError;
    console.warn = originalWarn;
  };
}

/**
 * Suppresses specific error messages in tests.
 * Useful when you want to silence only certain errors while keeping others visible.
 *
 * @param patterns - Array of strings or regex patterns to match against error messages
 * @example
 * ```ts
 * it('should handle specific errors', () => {
 *   const restore = suppressErrorsMatching([
 *     'Cannot read properties of undefined',
 *     /Failed to restore session/
 *   ]);
 *   // ... test code ...
 *   restore();
 * });
 * ```
 */
export function suppressErrorsMatching(patterns: (string | RegExp)[]) {
  const originalError = console.error;
  const originalWarn = console.warn;

  const shouldSuppress = (message: unknown): boolean => {
    const messageStr = String(message);
    return patterns.some((pattern) => {
      if (typeof pattern === "string") {
        return messageStr.includes(pattern);
      }
      return pattern.test(messageStr);
    });
  };

  console.error = vi.fn((...args: unknown[]) => {
    if (!shouldSuppress(args.join(" "))) {
      originalError(...args);
    }
  });

  console.warn = vi.fn((...args: unknown[]) => {
    if (!shouldSuppress(args.join(" "))) {
      originalWarn(...args);
    }
  });

  return () => {
    console.error = originalError;
    console.warn = originalWarn;
  };
}
