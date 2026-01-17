import type { Video } from "../schemas/video.schema";

export type NormalizedVideo = Pick<
  Video,
  | "id"
  | "title"
  | "description"
  | "url"
  | "thumbnailUrl"
  | "createdAt"
  | "channel"
  | "views"
  | "likes"
  | "dislikes"
  | "updatedAt"
  | "published"
>;
