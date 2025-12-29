import type { RootState } from "@/core/store";

export const selectAccessToken = (state: RootState) => state.auth.accessToken;

export const selectRefreshToken = (state: RootState) => state.auth.refreshToken;

export const selectIsAuthenticated = (state: RootState) =>
  state.auth.accessToken !== null;
