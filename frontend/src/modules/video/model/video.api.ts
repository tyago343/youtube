import { z } from "zod";
import { baseApi } from "@core/store/api.store";
import { VIDEO_TAG } from "@core/store/constants.store";
import type { RootState } from "@core/store";
import { videoSchema, type Video } from "../schemas/video.schema";
import { videosReceived, videoAdded } from "./video.slice";
import type { UploadVideoForm } from "../schemas/upload-video-form.schema";
import type { NormalizedVideo } from "../types/video.types";

export const videoApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllVideos: builder.query<Video[], void>({
      query: () => "/videos",
      transformResponse: (response: unknown) => {
        return z.array(videoSchema).parse(response);
      },
      providesTags: [VIDEO_TAG],
      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          if (data && data.length > 0) {
            const normalizedVideos: NormalizedVideo[] = data;
            dispatch(videosReceived(normalizedVideos));
          }
        } catch (error) {
          console.error("Failed to sync videos to store:", error);
        }
      },
    }),
    getVideo: builder.query<Video, string>({
      query: (id) => `/videos/${id}`,
      transformResponse: (response: unknown) => {
        return videoSchema.parse(response);
      },
      providesTags: (_result, _error, id) => [{ type: VIDEO_TAG, id }],
      async onQueryStarted(_arg, { queryFulfilled, dispatch, getState }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            const state = getState();
            const { video: videoState } = state as RootState;
            const existingVideoIds = new Set(Object.keys(videoState.entities));
            if (existingVideoIds.has(data.id)) {
              return;
            }

            dispatch(videoAdded(data));
          }
        } catch (error) {
          console.error("Failed to sync video to store:", error);
        }
      },
    }),
    uploadVideo: builder.mutation<
      Video,
      UploadVideoForm & { channelId: string }
    >({
      query: ({
        title,
        description,
        video,
        thumbnail,
        isPublic,
        channelId,
      }) => {
        const payload = new FormData();
        payload.append("title", title);
        payload.append("description", description);
        payload.append("video", video);
        payload.append("thumbnail", thumbnail ?? "");
        payload.append("isPublic", isPublic ? "true" : "false");
        payload.append("channelId", channelId);
        return {
          url: "/videos",
          method: "POST",
          body: payload,
          headers: {
            "Content-Type": "multipart/form-data",
          },
          formData: true,
        };
      },
      transformResponse: (response: unknown) => {
        return videoSchema.parse(response);
      },
    }),
  }),
});

export const {
  useGetAllVideosQuery,
  useGetVideoQuery,
  useUploadVideoMutation,
} = videoApi;
