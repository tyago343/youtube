import { z } from "zod";

export const updateAvatarResponseSchema = z.object({
  avatarUrl: z.url(),
});

export type UpdateAvatarResponse = z.infer<typeof updateAvatarResponseSchema>;
