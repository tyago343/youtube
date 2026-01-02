import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import userReducer, { userSlice } from "@/modules/user/model/user.slice";
import authReducer, { authSlice } from "@/modules/auth/model/auth.slice";
import videoReducer, { videoSlice } from "@/modules/video/model/video.slice";
import { baseApi } from "./api.store";

const store = configureStore({
  reducer: {
    [authSlice.reducerPath]: authReducer,
    [userSlice.reducerPath]: userReducer,
    [videoSlice.name]: videoReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export type RootState = ReturnType<typeof store.getState>;

export default store;
