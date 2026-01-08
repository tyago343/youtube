import { z } from "zod";

export const refreshTokenResponseSchema = z.object({
  accessToken: z.string().min(1),
  refreshToken: z.string().min(1),
});

export type RefreshTokenResponse = z.infer<typeof refreshTokenResponseSchema>;
