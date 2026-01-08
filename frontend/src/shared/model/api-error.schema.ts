import { z } from "zod";

export const apiErrorSchema = z.object({
  message: z.string(),
  error: z.string(),
  statusCode: z.number().int(),
});

export type ApiError = z.infer<typeof apiErrorSchema>;
