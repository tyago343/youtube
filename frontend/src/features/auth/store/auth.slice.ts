import { createSlice } from "@reduxjs/toolkit/react";
import type { User } from "../types/user.type";
import { registerUser } from "./auth.actions";

type AuthState = {
  loading: boolean;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  error: string | null;
  success: boolean;
};

const initialState: AuthState = {
  loading: false,
  user: null,
  accessToken: null,
  refreshToken: null,
  error: null,
  success: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(registerUser.fulfilled, (state) => {
      state.loading = false;
      state.success = true;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.success = false;
    });
  },
});
export default authSlice.reducer;
