import { z } from "zod";

export const tokenSchema = z.string().min(1);

export const themePreferenceSchema = z.string().min(1);
