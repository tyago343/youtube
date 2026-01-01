import { baseApi } from "@core/store/api.store";
import type { User } from "@user/types/user.type";
import { setCredentials } from "./auth.slice";
import { setUser } from "@user/model/user.slice";
import { toast } from "sonner";
import { saveAuthCredentials, clearAuthStorage } from "@shared/lib/storage";
import { clearCredentials } from "./auth.slice";
import { clearUser } from "@user/model/user.slice";
import type { ApiError } from "@shared/model/api-error.types";
import { extractErrorMessageFromBackendError } from "@shared/lib/errors.lib";
export type AuthResponse = {
  user: User;
  accessToken: string;
  refreshToken: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  username: string;
  email: string;
  password: string;
};

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            setCredentials({
              accessToken: data.accessToken,
              refreshToken: data.refreshToken,
            })
          );
          dispatch(setUser(data.user));
          saveAuthCredentials(data.accessToken, data.refreshToken);
        } catch (action: unknown) {
          const errorMessage = extractErrorMessageFromBackendError(
            (action as { error: { data: ApiError } }).error as {
              data: ApiError;
            }
          );
          toast.error(errorMessage);
        }
      },
    }),

    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (userData) => ({
        url: "/signup",
        method: "POST",
        body: userData,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          dispatch(
            setCredentials({
              accessToken: data.accessToken,
              refreshToken: data.refreshToken,
            })
          );

          dispatch(setUser(data.user));
          saveAuthCredentials(data.accessToken, data.refreshToken);
        } catch (action: unknown) {
          const errorMessage = extractErrorMessageFromBackendError(
            (action as { error: { data: ApiError } }).error as {
              data: ApiError;
            }
          );
          toast.error(errorMessage);
        }
      },
    }),

    getMe: builder.query<User, void>({
      query: () => ({
        url: "/me",
        method: "GET",
      }),
    }),

    refreshToken: builder.mutation<
      { accessToken: string; refreshToken: string },
      { refreshToken: string }
    >({
      query: ({ refreshToken }) => ({
        url: "/refresh",
        method: "POST",
        body: { refreshToken },
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          dispatch(
            setCredentials({
              accessToken: data.accessToken,
              refreshToken: data.refreshToken,
            })
          );

          saveAuthCredentials(data.accessToken, data.refreshToken);
        } catch (action: unknown) {
          const errorMessage = extractErrorMessageFromBackendError(
            (action as { error: { data: ApiError } }).error as {
              data: ApiError;
            }
          );
          // If refresh fails, clear everything
          toast.error(errorMessage);
          dispatch(clearCredentials());
          dispatch(clearUser());
          clearAuthStorage();
        }
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetMeQuery,
  useLazyGetMeQuery,
  useRefreshTokenMutation,
} = authApi;
