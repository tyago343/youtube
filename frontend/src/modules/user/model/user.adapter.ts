import { createEntityAdapter } from "@reduxjs/toolkit";
import type { User } from "../types/user.type";

export const userAdapter = createEntityAdapter<
  Pick<User, "id" | "username" | "avatarUrl">
>({
  sortComparer: (a, b) => a.username.localeCompare(b.username),
});
