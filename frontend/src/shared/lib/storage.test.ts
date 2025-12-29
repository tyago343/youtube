import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  clearAuthStorage,
  saveAuthCredentials,
  getStoredAccessToken,
  getStoredRefreshToken,
  getStoredCredentials,
} from "./storage";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

describe("storage", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorageMock.clear();
    // Mock global localStorage
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
      writable: true,
    });
  });

  describe("saveAuthCredentials", () => {
    it("should save accessToken and refreshToken as strings", () => {
      const accessToken = "test-access-token";
      const refreshToken = "test-refresh-token";

      saveAuthCredentials(accessToken, refreshToken);

      expect(localStorageMock.getItem("auth_accessToken")).toBe(accessToken);
      expect(localStorageMock.getItem("auth_refreshToken")).toBe(refreshToken);
    });

    it("should overwrite existing tokens", () => {
      saveAuthCredentials("old-token", "old-refresh");
      saveAuthCredentials("new-token", "new-refresh");

      expect(localStorageMock.getItem("auth_accessToken")).toBe("new-token");
      expect(localStorageMock.getItem("auth_refreshToken")).toBe("new-refresh");
    });
  });

  describe("getStoredAccessToken", () => {
    it("should return the stored accessToken", () => {
      const token = "test-access-token";
      localStorageMock.setItem("auth_accessToken", token);

      expect(getStoredAccessToken()).toBe(token);
    });

    it("should return null if no token is stored", () => {
      expect(getStoredAccessToken()).toBeNull();
    });

    it("should return the string as-is if token is invalid JSON", () => {
      // Store a value that is not a valid string
      localStorageMock.setItem("auth_accessToken", "{invalid json");

      // Should return the string as-is (not null) since it's not valid JSON
      expect(getStoredAccessToken()).toBe("{invalid json");
    });
  });

  describe("getStoredRefreshToken", () => {
    it("should return the stored refreshToken", () => {
      const token = "test-refresh-token";
      localStorageMock.setItem("auth_refreshToken", token);

      expect(getStoredRefreshToken()).toBe(token);
    });

    it("should return null if no token is stored", () => {
      expect(getStoredRefreshToken()).toBeNull();
    });
  });

  describe("getStoredCredentials", () => {
    it("should return both tokens when they are stored", () => {
      const accessToken = "test-access";
      const refreshToken = "test-refresh";

      localStorageMock.setItem("auth_accessToken", accessToken);
      localStorageMock.setItem("auth_refreshToken", refreshToken);

      const credentials = getStoredCredentials();

      expect(credentials.accessToken).toBe(accessToken);
      expect(credentials.refreshToken).toBe(refreshToken);
    });

    it("should return null for tokens not stored", () => {
      const credentials = getStoredCredentials();

      expect(credentials.accessToken).toBeNull();
      expect(credentials.refreshToken).toBeNull();
    });

    it("should return null for accessToken if only refreshToken is stored", () => {
      localStorageMock.setItem("auth_refreshToken", "test-refresh");

      const credentials = getStoredCredentials();

      expect(credentials.accessToken).toBeNull();
      expect(credentials.refreshToken).toBe("test-refresh");
    });
  });

  describe("clearAuthStorage", () => {
    it("should remove both tokens from localStorage", () => {
      localStorageMock.setItem("auth_accessToken", "token");
      localStorageMock.setItem("auth_refreshToken", "refresh");

      clearAuthStorage();

      expect(localStorageMock.getItem("auth_accessToken")).toBeNull();
      expect(localStorageMock.getItem("auth_refreshToken")).toBeNull();
    });

    it("should work even if no tokens are stored", () => {
      expect(() => clearAuthStorage()).not.toThrow();
    });
  });

  describe("type validation with objects", () => {
    it("should handle objects stored as JSON", () => {
      const testObject = { key: "value", number: 123 };
      localStorageMock.setItem("test_key", JSON.stringify(testObject));

      // Simulate getItem with generic type
      const stored = localStorageMock.getItem("test_key");
      const parsed = stored ? JSON.parse(stored) : null;

      expect(parsed).toEqual(testObject);
      expect(parsed.key).toBe("value");
      expect(parsed.number).toBe(123);
    });

    it("should validate that tokens are strings and not objects", () => {
      const accessToken = "string-token";
      const refreshToken = "string-refresh";

      saveAuthCredentials(accessToken, refreshToken);

      const storedAccess = getStoredAccessToken();
      const storedRefresh = getStoredRefreshToken();

      expect(typeof storedAccess).toBe("string");
      expect(typeof storedRefresh).toBe("string");
      expect(storedAccess).toBe(accessToken);
      expect(storedRefresh).toBe(refreshToken);
    });
  });

  describe("error handling", () => {
    it("should handle localStorage errors gracefully", () => {
      // Silence console.error during this test since errors are expected
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const errorMock = {
        getItem: vi.fn(() => {
          throw new Error("Storage error");
        }),
        setItem: vi.fn(() => {
          throw new Error("Storage error");
        }),
        removeItem: vi.fn(() => {
          throw new Error("Storage error");
        }),
      };

      Object.defineProperty(window, "localStorage", {
        value: errorMock,
        writable: true,
      });

      expect(() => getStoredAccessToken()).not.toThrow();
      expect(() => saveAuthCredentials("token", "refresh")).not.toThrow();
      expect(() => clearAuthStorage()).not.toThrow();

      // Verify that console.error was called (errors are handled correctly)
      expect(consoleErrorSpy).toHaveBeenCalled();

      // Restore console.error
      consoleErrorSpy.mockRestore();
    });

    it("should handle environment without window (SSR)", () => {
      const originalWindow = globalThis.window;
      // @ts-expect-error - Simulating environment without window
      delete globalThis.window;

      expect(() => getStoredAccessToken()).not.toThrow();
      expect(() => saveAuthCredentials("token", "refresh")).not.toThrow();
      expect(() => clearAuthStorage()).not.toThrow();

      expect(getStoredAccessToken()).toBeNull();

      globalThis.window = originalWindow;
    });
  });
});
