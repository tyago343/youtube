import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import type { RootState } from "./index";
import { API_BASE_URL } from "./constants.store";
import { setCredentials, clearCredentials } from "@auth/model/auth.slice";
import { clearUser } from "@user/model/user.slice";
import { saveAuthCredentials, clearAuthStorage } from "@/shared/lib/storage";
import { toast } from "sonner";

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // If we get a 401 and we have a refresh token, try to refresh
  if (result.error && result.error.status === 401) {
    const state = api.getState() as RootState;
    const refreshToken = state.auth.refreshToken;

    // Check if we have a refresh token and
    if (refreshToken) {
      try {
        // Try to refresh the token
        const refreshResult = await baseQuery(
          {
            url: "/refresh",
            method: "POST",
            body: { refreshToken },
          },
          api,
          extraOptions
        );

        if (refreshResult.data) {
          const { accessToken, refreshToken: newRefreshToken } =
            refreshResult.data as {
              accessToken: string;
              refreshToken: string;
            };

          api.dispatch(
            setCredentials({
              accessToken,
              refreshToken: newRefreshToken,
            })
          );

          saveAuthCredentials(accessToken, newRefreshToken);

          result = await baseQuery(args, api, extraOptions);
        } else {
          api.dispatch(clearCredentials());
          api.dispatch(clearUser());
          clearAuthStorage();
        }
      } catch (error) {
        toast.error("Refresh token failed: " + error);
        api.dispatch(clearCredentials());
        api.dispatch(clearUser());
        clearAuthStorage();
      }
    } else {
      toast.error("No refresh token");
      api.dispatch(clearCredentials());
      api.dispatch(clearUser());
      clearAuthStorage();
    }
  }

  return result;
};
