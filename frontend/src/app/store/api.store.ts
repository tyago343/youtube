import { createApi } from "@reduxjs/toolkit/query/react";
import { API_STORE_NAME, API_TAGS } from "./constants.store";
import { baseQueryWithReauth } from "./base-query-with-reauth";

export const baseApi = createApi({
  reducerPath: API_STORE_NAME,
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
  tagTypes: API_TAGS,
});
