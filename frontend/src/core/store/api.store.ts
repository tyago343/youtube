import { createApi } from "@reduxjs/toolkit/query/react";
import { API_TAGS, STORE_NAMES } from "./constants.store";
import { baseQueryWithReauth } from "./base-query-with-reauth";

export const baseApi = createApi({
  reducerPath: STORE_NAMES.API,
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
  tagTypes: API_TAGS,
});
