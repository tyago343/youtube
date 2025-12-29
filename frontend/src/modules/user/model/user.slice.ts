import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../types/user.type";
import { STORE_NAMES } from "@core/store/constants.store";
type UserState = {
  currentUser: User | null;
};

const initialState: UserState = {
  currentUser: null,
};

export const userSlice = createSlice({
  name: STORE_NAMES.USER,
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
    },
    clearUser: (state) => {
      state.currentUser = null;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload };
      }
    },
    updateUserAvatar: (state, action: PayloadAction<string>) => {
      if (state.currentUser) {
        state.currentUser.avatarUrl = action.payload;
      }
    },
  },
});

export const { setUser, clearUser, updateUser, updateUserAvatar } =
  userSlice.actions;

export default userSlice.reducer;
