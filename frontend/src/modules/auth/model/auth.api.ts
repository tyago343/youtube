import { baseApi } from "@/app/store/api.store";
import type { User } from "@user/types/user.type";
import { setCredentials } from "./auth.slice";
import { setUser } from "@user/model/user.slice";
import { toast } from "sonner";
import {
  saveAuthCredentials,
  clearAuthStorage,
  getStoredAccessToken,
} from "@/shared/lib/storage";
import { clearCredentials } from "./auth.slice";
import { clearUser } from "@user/model/user.slice";
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
        } catch (error) {
          toast.error("Login failed: " + error);
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
        } catch (error) {
          toast.error("Register failed: " + error);
        }
      },
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;

          dispatch(clearCredentials());
          dispatch(clearUser());
          clearAuthStorage();
        } catch (error) {
          toast.error("Logout failed: " + error);
          const { clearCredentials } = await import("./auth.slice");
          const { clearUser } = await import("@user/model/user.slice");

          dispatch(clearCredentials());
          dispatch(clearUser());
          clearAuthStorage();
        }
      },
    }),

    getMe: builder.query<User, void>({
      query: () => ({
        url: "/me",
        method: "GET",
        headers: {
          Authorization: `Bearer ${getStoredAccessToken() ?? ""}`,
        },
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetMeQuery,
  useLazyGetMeQuery,
} = authApi;
