import { z } from "zod";
import { ownerSummarySchema } from "@user/schemas/owner-summary.schema";

export const videoSchema = z.object({
  id: z.uuid(),
  title: z.string().min(1),
  description: z.string().min(1),
  url: z.url(),
  thumbnailUrl: z.url(),
  createdAt: z.iso.datetime().or(z.date()),
  updatedAt: z.iso.datetime().or(z.date()).optional().nullable(),
  views: z.number().int().nonnegative(),
  likes: z.number().int().nonnegative(),
  dislikes: z.number().int().nonnegative(),
  isPublic: z.boolean(),
  ownerId: z.uuid(),
  owner: ownerSummarySchema,
  published: z.iso.datetime().or(z.date()).optional().nullable(),
});

export type Video = z.infer<typeof videoSchema>;
