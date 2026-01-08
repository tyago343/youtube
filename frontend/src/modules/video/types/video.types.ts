import type { Video } from "../schemas/video.schema";

export type NormalizedVideo = Pick<
  Video,
  | "id"
  | "title"
  | "description"
  | "url"
  | "thumbnailUrl"
  | "createdAt"
  | "ownerId"
>;
