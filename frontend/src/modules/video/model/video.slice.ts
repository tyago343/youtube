import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { STORE_NAMES } from "@core/store/constants.store";
import { videoAdapter } from "./video.adapter";
import type { NormalizedVideo } from "../types/video.types";

const initialState = videoAdapter.getInitialState();

export const videoSlice = createSlice({
  name: STORE_NAMES.VIDEO,
  initialState,
  reducers: {
    videoAdded: videoAdapter.addOne,
    videosReceived: (state, action: PayloadAction<NormalizedVideo[]>) => {
      videoAdapter.setAll(state, action.payload);
    },
    videosAdded: videoAdapter.addMany,
  },
});

export const { videoAdded, videosReceived, videosAdded } = videoSlice.actions;

export default videoSlice.reducer;
