import { z } from "zod";

export const ownerSummarySchema = z.object({
  id: z.uuid(),
  username: z.string().min(1),
  avatarUrl: z.url().optional().nullable(),
});

export type OwnerSummary = z.infer<typeof ownerSummarySchema>;
