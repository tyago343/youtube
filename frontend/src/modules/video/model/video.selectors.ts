import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@core/store";
import type { NormalizedVideo, Video } from "../types/video.types";
import { selectUserEntities } from "@/modules/user/model/user.selectors";
import { videoAdapter } from "./video.adapter";

const selectVideoState = (state: RootState) => state.video;

export const {
  selectAll: selectAllVideos,
  selectById: selectVideoById,
  selectIds: selectVideoIds,
  selectEntities: selectVideoEntities,
  selectTotal: selectTotalVideos,
} = videoAdapter.getSelectors(selectVideoState);

export const selectVideoWithOwner = createSelector(
  [selectVideoById, selectUserEntities],
  (
    video: NormalizedVideo | undefined,
    userEntities
  ):
    | Pick<
        Video,
        | "id"
        | "title"
        | "description"
        | "url"
        | "thumbnailUrl"
        | "createdAt"
        | "ownerId"
        | "owner"
      >
    | undefined => {
    if (!video) return undefined;
    const owner = userEntities[video.ownerId];
    if (!owner) return undefined;
    return {
      ...video,
      owner,
    };
  }
);

export const selectAllVideosWithOwner = createSelector(
  [selectAllVideos, selectUserEntities],
  (videos: NormalizedVideo[], userEntities): Video[] => {
    return videos
      .map((video) => {
        const owner = userEntities[video.ownerId];
        if (!owner) return null;
        return { ...video, owner };
      })
      .filter((video): video is Video => video !== null);
  }
);

export const selectVideosByOwnerId = createSelector(
  [selectAllVideos, (_state: RootState, ownerId: string) => ownerId],
  (videos, ownerId) => videos.filter((video) => video.ownerId === ownerId)
);
