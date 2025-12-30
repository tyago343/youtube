import { baseApi } from "@/core/store/api.store";
import { setUser, updateUserAvatar } from "./user.slice";
import { toast } from "sonner";
import type { User } from "../types/user.type";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    updateAvatar: builder.mutation<
      { avatarUrl: string },
      { id: string; file: File }
    >({
      query: ({ id, file }) => {
        const payload = new FormData();
        payload.append("avatar", file);
        return {
          url: `/users/${id}/upload-avatar`,
          method: "POST",
          body: payload,
          headers: {
            "Content-Type": "multipart/form-data",
          },
          formData: true,
        };
      },
      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          toast.success("Avatar updated successfully");
          dispatch(updateUserAvatar(data.avatarUrl));
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          const errorMessage =
            error?.error?.data?.message ||
            error?.data?.message ||
            error?.message ||
            "Failed to update avatar";

          toast.error(errorMessage);
        }
      },
    }),
    updateUser: builder.mutation<User, { id: string; data: Partial<User> }>({
      query: ({ id, data }) => {
        return {
          url: `/users/${id}`,
          method: "PATCH",
          body: data,
        };
      },
      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          toast.success("User updated successfully");
          dispatch(setUser(data));
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          const errorMessage =
            error?.error?.data?.message ||
            error?.data?.message ||
            error?.message ||
            "Failed to update user";

          toast.error(errorMessage);
        }
      },
    }),
  }),
});

export const { useUpdateAvatarMutation, useUpdateUserMutation } = userApi;
