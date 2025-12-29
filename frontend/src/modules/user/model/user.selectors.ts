import type { RootState } from "@/core/store";
import { createSelector } from "@reduxjs/toolkit";

export const selectUser = createSelector(
  (state: RootState) => state.user.currentUser,
  (currentUser) => currentUser
);
