import { z } from "zod";

export const uploadVideoSchema = z.object({
  title: z.string("Title is required").min(1),
  description: z.string("Description is required").min(1),
  video: z.instanceof(File, { message: "Video is required" }),
  thumbnail: z
    .instanceof(File, { message: "Thumbnail is required" })
    .optional(),
  isPublic: z.boolean().optional(),
});

export type UploadVideoForm = z.infer<typeof uploadVideoSchema>;
