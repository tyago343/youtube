import type { NormalizedVideo, Video } from "../types/video.types";
import { baseApi } from "@core/store/api.store";
import { videosReceived, videoAdded } from "./video.slice";
import { usersAdded } from "@/modules/user/model/user.slice";
import { VIDEO_TAG } from "@core/store/constants.store";
import type { RootState } from "@core/store";
import type { UploadVideoForm } from "../schemas/UploadVideoForm.schema";

const normalizeVideo = (video: Video): NormalizedVideo => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { owner, ...videoWithoutOwner } = video;
  return videoWithoutOwner;
};

export const videoApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllVideos: builder.query<Video[], void>({
      query: () => "/videos",
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

            const { user: userState } = getState() as RootState;
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
      providesTags: (_result, _error, id) => [{ type: VIDEO_TAG, id }],
      async onQueryStarted(_arg, { queryFulfilled, dispatch, getState }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            if (data.owner) {
              const { user: userState, video: videoState } =
                getState() as RootState;
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
      }
    ),
  }),
});

export const {
  useGetAllVideosQuery,
  useGetVideoQuery,
  useUploadVideoMutation,
} = videoApi;
