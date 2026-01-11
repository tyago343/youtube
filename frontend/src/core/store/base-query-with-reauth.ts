import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { toast } from "sonner";
import { saveAuthCredentials, clearAuthStorage } from "@shared/lib/storage";
import { setCredentials, clearCredentials } from "@auth/model/auth.slice";
import { refreshTokenResponseSchema } from "@auth/schemas/refresh-token-response.schema";
import { clearUser } from "@user/model/user.slice";
import type { RootState } from "./index";
import { API_BASE_URL } from "./constants.store";

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.accessToken;
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
  if (result.error && result.error.status === 401) {
    const state = api.getState() as RootState;
    const refreshToken = state.auth.refreshToken;

    if (refreshToken) {
      try {
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
          const parseResult = refreshTokenResponseSchema.safeParse(
            refreshResult.data
          );

          if (parseResult.success) {
            const { accessToken, refreshToken: newRefreshToken } =
              parseResult.data;

            api.dispatch(
              setCredentials({
                accessToken,
                refreshToken: newRefreshToken,
              })
            );

            saveAuthCredentials(accessToken, newRefreshToken);

            result = await baseQuery(args, api, extraOptions);
          } else {
            console.error(
              "Invalid refresh token response format:",
              parseResult.error
            );
            api.dispatch(clearCredentials());
            api.dispatch(clearUser());
            clearAuthStorage();
          }
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
