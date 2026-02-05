import * as z from "zod";

export const loginSchema = z.object({
  email: z.email("Invalid email"),
  password: z
    .string("Password is required")
    .min(8, "Must be at least 8 characters"),
});

export type LoginSchema = z.output<typeof loginSchema>;

export const userSchema = z.object({
  id: z.string(),
  email: z.string(),
  username: z.string(),
  avatarUrl: z.string().optional(),
  createdAt: z.string(),
  role: z.string(),
});

export type UserSchema = z.infer<typeof userSchema>;

export const refreshTokenResponseSchema = z.object({
  accessToken: z.string().min(1),
  refreshToken: z.string().min(1),
  user: userSchema.optional(),
});

export type RefreshTokenResponse = z.infer<typeof refreshTokenResponseSchema>;
