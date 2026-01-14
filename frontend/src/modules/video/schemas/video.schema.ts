import { z } from "zod";

const channelSummarySchema = z.object({
  id: z.uuid(),
  name: z.string().min(1),
  avatarUrl: z.url(),
});

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
  visibility: z.enum(["PUBLIC", "PRIVATE", "MEMBERS"]),
  channelId: z.uuid(),
  channel: channelSummarySchema,
  published: z.iso.datetime().or(z.date()).optional().nullable(),
});

export type Video = z.infer<typeof videoSchema>;
export type ChannelSummary = z.infer<typeof channelSummarySchema>;
