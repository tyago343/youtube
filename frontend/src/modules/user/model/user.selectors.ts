import type { RootState } from "@/core/store";
import { createSelector } from "@reduxjs/toolkit";
import { userAdapter } from "./user.adapter";

const selectUserState = (state: RootState) => state.user;

export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectIds: selectUserIds,
  selectEntities: selectUserEntities,
  selectTotal: selectTotalUsers,
} = userAdapter.getSelectors(selectUserState);

export const selectUser = createSelector(
  [selectUserState],
  (userState) => userState.currentUser
);

export const selectCurrentUserFromEntities = createSelector(
  [selectUser, selectUserEntities],
  (currentUser, userEntities) => {
    if (!currentUser) return null;
    return userEntities[currentUser.id] || currentUser;
  }
);
