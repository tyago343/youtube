import { z } from "zod";

export const envSchema = z.object({
  VITE_API_URL: z
    .url("VITE_API_URL must be a valid URL")
    .refine(
      (url) => url.endsWith("/"),
      "VITE_API_URL must end with a trailing slash (/)"
    ),
});

export type Env = z.infer<typeof envSchema>;
