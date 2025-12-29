import { USER_TAG } from "@user/model/user.constants";
import { env } from "../config/env";

export const API_STORE_NAME = "api";
export const API_BASE_URL = env.VITE_API_URL;
export const API_TAGS = [USER_TAG];
