import { z } from "zod";
import { baseApi } from "@core/store/api.store";
import { VIDEO_TAG } from "@core/store/constants.store";
import type { RootState } from "@core/store";
import { usersAdded } from "@user/model/user.slice";
import { videoSchema, type Video } from "../schemas/video.schema";
import { videosReceived, videoAdded } from "./video.slice";
import type { UploadVideoForm } from "../schemas/UploadVideoForm.schema";
import type { NormalizedVideo } from "../types/video.types";

const normalizeVideo = (video: Video): NormalizedVideo => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { owner, ...videoWithoutOwner } = video;
  return videoWithoutOwner;
};

export const videoApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllVideos: builder.query<Video[], void>({
      query: () => "/videos",
      transformResponse: (response: unknown) => {
        return z.array(videoSchema).parse(response);
      },
      providesTags: [VIDEO_TAG],
      async onQueryStarted(_arg, { queryFulfilled, dispatch, getState }) {
        try {
          const { data } = await queryFulfilled;
          if (data && data.length > 0) {
            const owners = data
              .map((video) => video.owner)
              .filter(
                (owner): owner is NonNullable<typeof owner> =>
                  owner !== null && owner !== undefined
              );

            const state = getState();
            const { user: userState } = state as RootState;
            const existingUserIds = new Set(Object.keys(userState.entities));

            const uniqueOwnersMap = new Map(
              owners.map((owner) => [
                owner.id,
                {
                  id: owner.id,
                  username: owner.username,
                  avatarUrl: owner.avatarUrl || "",
                },
              ])
            );
            const newOwners = Array.from(uniqueOwnersMap.values()).filter(
              (owner) => !existingUserIds.has(owner.id)
            );
            if (newOwners.length > 0) {
              dispatch(usersAdded(newOwners));
            }
            const normalizedVideos: NormalizedVideo[] =
              data.map(normalizeVideo);
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
            if (data.owner) {
              const state = getState();
              const { user: userState, video: videoState } = state as RootState;
              const existingVideoIds = new Set(
                Object.keys(videoState.entities)
              );
              if (existingVideoIds.has(data.id)) {
                return;
              }
              const existingUserIds = new Set(Object.keys(userState.entities));

              if (!existingUserIds.has(data.owner.id)) {
                const ownerAsUser = {
                  id: data.owner.id,
                  username: data.owner.username,
                  avatarUrl: data.owner.avatarUrl || "",
                };
                dispatch(usersAdded([ownerAsUser]));
              }
            }

            const normalizedVideo = normalizeVideo(data);

            dispatch(videoAdded(normalizedVideo));
          }
        } catch (error) {
          console.error("Failed to sync video to store:", error);
        }
      },
    }),
    uploadVideo: builder.mutation<Video, UploadVideoForm & { ownerId: string }>(
      {
        query: ({
          title,
          description,
          video,
          thumbnail,
          isPublic,
          ownerId,
        }) => {
          const payload = new FormData();
          payload.append("title", title);
          payload.append("description", description);
          payload.append("video", video);
          payload.append("thumbnail", thumbnail ?? "");
          payload.append("isPublic", isPublic ? "true" : "false");
          payload.append("ownerId", ownerId);
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
      }
    ),
  }),
});

export const {
  useGetAllVideosQuery,
  useGetVideoQuery,
  useUploadVideoMutation,
} = videoApi;
