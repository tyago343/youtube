import { z } from "zod";

export const channelSchema = z.object({
  id: z.uuid(),
  ownerId: z.uuid(),
  name: z.string().min(1),
  description: z.string(),
  avatarUrl: z.url().nullish(),
  bannerUrl: z.url().nullish(),
  createdAt: z.iso.datetime().or(z.date()),
});

export const channelsResponseSchema = z.array(channelSchema);

export type Channel = z.infer<typeof channelSchema>;
