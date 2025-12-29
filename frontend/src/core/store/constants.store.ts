import { env } from "../config/env";

export const API_BASE_URL = env.VITE_API_URL;

export const USER_TAG = "User";

export const API_TAGS = [USER_TAG];

export const STORE_NAMES = {
  API: "api",
  AUTH: "auth",
  USER: "user",
  VIDEO: "video",
} as const;
