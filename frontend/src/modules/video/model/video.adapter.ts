import { createEntityAdapter } from "@reduxjs/toolkit";
import type { NormalizedVideo } from "../types/video.types";

export const videoAdapter = createEntityAdapter<NormalizedVideo>({
  sortComparer: (a, b) =>
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
});
