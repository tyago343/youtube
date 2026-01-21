import { z } from "zod";

export const userSchema = z.object({
  id: z.uuid(),
  email: z.email(),
  username: z.string().min(1),
  avatarUrl: z.url().nullable(),
  createdAt: z.iso.datetime().or(z.date()),
});

export type User = z.infer<typeof userSchema>;
