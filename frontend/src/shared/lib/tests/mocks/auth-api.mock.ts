import { vi } from "vitest";
import type { User } from "@user/types/user.type";

export const createAuthApiMocks = () => {
  const mockGetMe = vi.fn();
  const mockUseLazyGetMeQuery = vi.fn();

  const setupMocks = () => {
    mockUseLazyGetMeQuery.mockReturnValue({ isLoading: false });
    mockGetMe.mockReturnValue({
      unwrap: vi.fn(),
    });
  };

  const resetMocks = () => {
    vi.clearAllMocks();
    setupMocks();
  };

  return {
    mockGetMe,
    mockUseLazyGetMeQuery,
    setupMocks,
    resetMocks,
  };
};

export const mockGetMeSuccess = (
  mockGetMe: ReturnType<typeof vi.fn>,
  user: User
) => {
  const unwrapMock = vi.fn().mockResolvedValue(user);
  mockGetMe.mockReturnValue({
    unwrap: unwrapMock,
  });
  return unwrapMock;
};

export const mockGetMeFailure = (
  mockGetMe: ReturnType<typeof vi.fn>,
  error: Error
) => {
  mockGetMe.mockReturnValue({
    unwrap: vi.fn().mockRejectedValue(error),
  });
};

export const mockGetMeUndefined = (mockGetMe: ReturnType<typeof vi.fn>) => {
  mockGetMe.mockReturnValue({
    unwrap: vi.fn().mockResolvedValue(undefined),
  });
};
