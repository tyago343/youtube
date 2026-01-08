import { z } from "zod";
import { userSchema } from "@user/schemas/user.schema";

export const authResponseSchema = z.object({
  accessToken: z.string().min(1),
  refreshToken: z.string().min(1),
  user: userSchema,
});

export type AuthResponse = z.infer<typeof authResponseSchema>;
