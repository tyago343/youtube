import { z } from "zod";

export const profileFormSchema = z.object({
  username: z.string(),
  email: z.email(),
});

export type profileFormSchemaType = z.infer<typeof profileFormSchema>;
