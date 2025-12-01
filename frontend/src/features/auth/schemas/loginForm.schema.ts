import * as z from "zod";

export const LoginFormSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(15, { message: "Username must be less than 15 characters long" }),
});

export type LoginFormSchemaType = z.infer<typeof LoginFormSchema>;
