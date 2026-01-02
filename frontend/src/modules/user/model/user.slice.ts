import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../types/user.type";
import { STORE_NAMES } from "@core/store/constants.store";
import { userAdapter } from "./user.adapter";

type UserState = ReturnType<typeof userAdapter.getInitialState> & {
  currentUser: User | null;
};

const initialState: UserState = {
  ...userAdapter.getInitialState(),
  currentUser: null,
};

export const userSlice = createSlice({
  name: STORE_NAMES.USER,
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
      userAdapter.upsertOne(state, action.payload);
    },
    clearUser: (state) => {
      state.currentUser = null;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload };
        userAdapter.updateOne(state, {
          id: state.currentUser.id,
          changes: action.payload,
        });
      }
    },
    updateUserAvatar: (state, action: PayloadAction<string>) => {
      if (state.currentUser) {
        state.currentUser.avatarUrl = action.payload;
        userAdapter.updateOne(state, {
          id: state.currentUser.id,
          changes: { avatarUrl: action.payload },
        });
      }
    },

    userAdded: userAdapter.addOne,
    userUpdated: userAdapter.updateOne,
    userRemoved: userAdapter.removeOne,
    usersReceived: (state, action: PayloadAction<User[]>) => {
      userAdapter.setAll(state, action.payload);
    },
    usersAdded: userAdapter.addMany,
    usersUpdated: userAdapter.updateMany,
    usersRemoved: userAdapter.removeMany,
    usersCleared: userAdapter.removeAll,
  },
});

export const {
  setUser,
  clearUser,
  updateUser,
  updateUserAvatar,
  userAdded,
  userUpdated,
  userRemoved,
  usersReceived,
  usersAdded,
  usersUpdated,
  usersRemoved,
  usersCleared,
} = userSlice.actions;

export default userSlice.reducer;
