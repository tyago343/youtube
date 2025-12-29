import type { RootState } from "@/core/store";

export const selectUser = (state: RootState) => state.user.currentUser;
