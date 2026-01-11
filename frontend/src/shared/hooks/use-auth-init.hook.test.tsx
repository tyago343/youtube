import { describe, it, expect, beforeEach, vi } from "vitest";
import { waitFor } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { useAuthInit } from "./use-auth-init.hook..ts";
import * as storage from "@/shared/lib/storage";
import authReducer, {
  authSlice,
  setCredentials,
  clearCredentials,
} from "@auth/model/auth.slice";
import { setUser } from "@user/model/user.slice";
import type { User } from "@user/types/user.type";
import userReducer, { userSlice } from "@user/model/user.slice";
import { baseApi } from "@core/store/api.store";
import { renderHook } from "@shared/lib/tests/test-utils";
import { setupLocalStorageMock } from "@/shared/lib/tests/mocks/local-storage.mock.ts";
import {
  createAuthApiMocks,
  mockGetMeSuccess,
  mockGetMeFailure,
  mockGetMeUndefined,
} from "@shared/lib/tests/mocks/auth-api.mock";
import { suppressExpectedErrors } from "@shared/lib/tests/suppress-expected-errors";

// Mock dependencies
vi.mock("@/shared/lib/storage", () => ({
  getStoredCredentials: vi.fn(),
  clearAuthStorage: vi.fn(),
}));

const authApiMocks = createAuthApiMocks();

vi.mock("@auth/model/auth.api", () => ({
  useLazyGetMeQuery: () => [
    authApiMocks.mockGetMe,
    authApiMocks.mockUseLazyGetMeQuery(),
  ],
}));

describe("useAuthInit", () => {
  let store: ReturnType<typeof configureStore>;
  let dispatchSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Clear all mocks
    vi.clearAllMocks();
    setupLocalStorageMock();

    // Create a test store
    store = configureStore({
      reducer: {
        [userSlice.reducerPath]: userReducer,
        [authSlice.name]: authReducer,
        [baseApi.reducerPath]: baseApi.reducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(baseApi.middleware),
    });

    // Spy on dispatch
    dispatchSpy = vi.spyOn(store, "dispatch");

    // Reset auth API mocks
    authApiMocks.resetMocks();
  });

  describe("when no tokens are stored", () => {
    it("should set isInitialized to true immediately without calling getMe", async () => {
      vi.mocked(storage.getStoredCredentials).mockReturnValue({
        accessToken: null,
        refreshToken: null,
      });

      const { result } = renderHook(() => useAuthInit(), { store });

      // Should be initialized immediately
      expect(result.current.isInitialized).toBe(true);
      expect(result.current.isLoading).toBe(false);

      // Should not call getMe
      expect(authApiMocks.mockGetMe).not.toHaveBeenCalled();

      // Should not dispatch any actions
      expect(dispatchSpy).not.toHaveBeenCalled();
    });
  });

  describe("when tokens are stored and getMe succeeds", () => {
    it("should restore session successfully", async () => {
      const accessToken = "test-access-token";
      const refreshToken = "test-refresh-token";
      // @ts-expect-error - mock user
      const mockUser: User = {
        id: "user-1",
        username: "testuser",
        email: "test@example.com",
        avatarUrl: "https://example.com/avatar.jpg",
      };

      vi.mocked(storage.getStoredCredentials).mockReturnValue({
        accessToken,
        refreshToken,
      });

      mockGetMeSuccess(authApiMocks.mockGetMe, mockUser);

      const { result } = renderHook(() => useAuthInit(), { store });

      // Wait for async operations to complete
      await waitFor(
        () => {
          expect(result.current.isInitialized).toBe(true);
        },
        { timeout: 1000 }
      );

      // Should dispatch setCredentials with stored tokens
      expect(dispatchSpy).toHaveBeenCalledWith(
        setCredentials({
          accessToken,
          refreshToken,
        })
      );

      // Should call getMe
      expect(authApiMocks.mockGetMe).toHaveBeenCalledTimes(1);

      // Should dispatch setUser with the user data
      await waitFor(() => {
        expect(dispatchSpy).toHaveBeenCalledWith(setUser(mockUser));
      });

      // Should not clear storage or credentials
      expect(storage.clearAuthStorage).not.toHaveBeenCalled();
      expect(dispatchSpy).not.toHaveBeenCalledWith(clearCredentials());
    });
  });

  describe("when tokens are stored but getMe fails", () => {
    it("should clear credentials and storage on error", async () => {
      const accessToken = "test-access-token";
      const refreshToken = "test-refresh-token";
      const mockError = new Error("Unauthorized");

      vi.mocked(storage.getStoredCredentials).mockReturnValue({
        accessToken,
        refreshToken,
      });

      mockGetMeFailure(authApiMocks.mockGetMe, mockError);

      // Mock console.warn to avoid noise in test output
      const consoleWarnSpy = vi
        .spyOn(console, "warn")
        .mockImplementation(() => {});

      const { result } = renderHook(() => useAuthInit(), { store });

      // Initially should not be initialized
      expect(result.current.isInitialized).toBe(false);

      // Wait for async operations
      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      // Should dispatch setCredentials first (before the error)
      expect(dispatchSpy).toHaveBeenCalledWith(
        setCredentials({
          accessToken,
          refreshToken,
        })
      );

      // Should call getMe
      expect(authApiMocks.mockGetMe).toHaveBeenCalledTimes(1);

      // Should clear credentials and storage on error
      await waitFor(() => {
        expect(dispatchSpy).toHaveBeenCalledWith(clearCredentials());
      });

      expect(storage.clearAuthStorage).toHaveBeenCalledTimes(1);

      // Should log the error
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "Failed to restore session:",
        mockError
      );

      consoleWarnSpy.mockRestore();
    });
  });

  describe("when only accessToken is stored (no refreshToken)", () => {
    it("should still attempt to restore session but not dispatch setCredentials", async () => {
      const accessToken = "test-access-token";
      // @ts-expect-error - mock user
      const mockUser: User = {
        id: "user-1",
        username: "testuser",
        email: "test@example.com",
        avatarUrl: "https://example.com/avatar.jpg",
      };

      vi.mocked(storage.getStoredCredentials).mockReturnValue({
        accessToken,
        refreshToken: null,
      });

      mockGetMeSuccess(authApiMocks.mockGetMe, mockUser);

      const { result } = renderHook(() => useAuthInit(), { store });

      // Should not be initialized immediately
      expect(result.current.isInitialized).toBe(false);

      // Should NOT dispatch setCredentials (because refreshToken is missing)
      // The hook only dispatches setCredentials when both tokens are present
      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      expect(dispatchSpy).not.toHaveBeenCalledWith(
        setCredentials({
          accessToken,
          refreshToken: "",
        })
      );

      // Should still call getMe to try to restore session
      expect(authApiMocks.mockGetMe).toHaveBeenCalledTimes(1);

      // Should dispatch setUser if getMe succeeds
      await waitFor(() => {
        expect(dispatchSpy).toHaveBeenCalledWith(setUser(mockUser));
      });
    });
  });

  describe("loading state", () => {
    it("should reflect isLoading from the query", () => {
      vi.mocked(storage.getStoredCredentials).mockReturnValue({
        accessToken: null,
        refreshToken: null,
      });

      // Mock loading state
      authApiMocks.mockUseLazyGetMeQuery.mockReturnValue({ isLoading: true });

      const { result } = renderHook(() => useAuthInit(), { store });

      expect(result.current.isLoading).toBe(true);
    });

    it("should reflect not loading when query is not loading", () => {
      vi.mocked(storage.getStoredCredentials).mockReturnValue({
        accessToken: null,
        refreshToken: null,
      });

      // Mock not loading state
      authApiMocks.mockUseLazyGetMeQuery.mockReturnValue({ isLoading: false });

      const { result } = renderHook(() => useAuthInit(), { store });

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe("edge cases", () => {
    it("should handle getMe returning undefined", async () => {
      const accessToken = "test-access-token";
      const refreshToken = "test-refresh-token";

      vi.mocked(storage.getStoredCredentials).mockReturnValue({
        accessToken,
        refreshToken,
      });

      mockGetMeUndefined(authApiMocks.mockGetMe);

      // Suppress expected error from Redux Toolkit adapter when undefined is passed
      const suppressErrors = suppressExpectedErrors();

      const { result } = renderHook(() => useAuthInit(), { store });

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      // Should still call getMe
      expect(authApiMocks.mockGetMe).toHaveBeenCalledTimes(1);

      suppressErrors();
    });

    it("should only initialize once per mount", async () => {
      const accessToken = "test-access-token";
      const refreshToken = "test-refresh-token";
      // @ts-expect-error - mock user
      const mockUser: User = {
        id: "user-1",
        username: "testuser",
        email: "test@example.com",
        avatarUrl: "https://example.com/avatar.jpg",
      };

      vi.mocked(storage.getStoredCredentials).mockReturnValue({
        accessToken,
        refreshToken,
      });

      mockGetMeSuccess(authApiMocks.mockGetMe, mockUser);

      const { result, rerender } = renderHook(() => useAuthInit(), { store });

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      const initialCallCount = authApiMocks.mockGetMe.mock.calls.length;

      // Rerender should not trigger another initialization
      rerender();

      await waitFor(() => {
        // getMe should still only be called once
        expect(authApiMocks.mockGetMe).toHaveBeenCalledTimes(initialCallCount);
      });
    });
  });
});
