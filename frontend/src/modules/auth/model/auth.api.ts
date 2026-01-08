import { toast } from "sonner";
import { baseApi } from "@core/store/api.store";
import { apiErrorSchema } from "@shared/model/api-error.schema";
import { extractErrorMessageFromBackendError } from "@shared/lib/errors.lib";
import { saveAuthCredentials, clearAuthStorage } from "@shared/lib/storage";
import { setUser, clearUser } from "@user/model/user.slice";
import { userSchema, type User } from "@user/schemas/user.schema";
import { clearCredentials, setCredentials } from "./auth.slice";
import {
  authResponseSchema,
  type AuthResponse,
} from "../schemas/auth-response.schema";
import {
  refreshTokenResponseSchema,
  type RefreshTokenResponse,
} from "../schemas/refresh-token-response.schema";

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  username: string;
  email: string;
  password: string;
};

function isApiError(error: unknown): error is { data: unknown } {
  return typeof error === "object" && error !== null && "data" in error;
}

function extractApiError(error: unknown): string {
  if (!isApiError(error)) {
    return "An unknown error occurred";
  }

  const parseResult = apiErrorSchema.safeParse(error.data);
  if (parseResult.success) {
    return extractErrorMessageFromBackendError({ data: parseResult.data });
  }

  return "An unknown error occurred";
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: unknown) => {
        return authResponseSchema.parse(response);
      },
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
        } catch (error) {
          const errorMessage = extractApiError(error);
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
      transformResponse: (response: unknown) => {
        return authResponseSchema.parse(response);
      },
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
        } catch (error) {
          const errorMessage = extractApiError(error);
          toast.error(errorMessage);
        }
      },
    }),

    getMe: builder.query<User, void>({
      query: () => ({
        url: "/me",
        method: "GET",
      }),
      transformResponse: (response: unknown) => {
        return userSchema.parse(response);
      },
      serializeQueryArgs: () => "getMe",
    }),

    refreshToken: builder.mutation<
      RefreshTokenResponse,
      { refreshToken: string }
    >({
      query: ({ refreshToken }) => ({
        url: "/refresh",
        method: "POST",
        body: { refreshToken },
      }),
      transformResponse: (response: unknown) => {
        return refreshTokenResponseSchema.parse(response);
      },
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
        } catch (error) {
          const errorMessage = extractApiError(error);
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
