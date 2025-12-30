import type { Video } from "../types/video.types";
import { baseApi } from "@core/store/api.store";

export const videoApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllVideos: builder.query<Video[], void>({
      query: () => "/videos",
    }),
  }),
});

export const { useGetAllVideosQuery } = videoApi;
