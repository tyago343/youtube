import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import authReducer, { authSlice } from "@/modules/auth/store/auth.slice";

const store = configureStore({
  reducer: {
    [authSlice.reducerPath]: authReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export default store;
export type RootState = ReturnType<typeof store.getState>;
