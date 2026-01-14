import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@core/store";
import type { Video } from "../schemas/video.schema";
import { videoAdapter } from "./video.adapter";

const selectVideoState = (state: RootState) => state.video;

export const {
  selectAll: selectAllVideos,
  selectById: selectVideoById,
  selectIds: selectVideoIds,
  selectEntities: selectVideoEntities,
  selectTotal: selectTotalVideos,
} = videoAdapter.getSelectors(selectVideoState);

export const selectVideosByChannelId = createSelector(
  [selectAllVideos, (_state: RootState, channelId: string) => channelId],
  (videos: Video[], channelId) =>
    videos.filter((video) => video.channelId === channelId)
);
