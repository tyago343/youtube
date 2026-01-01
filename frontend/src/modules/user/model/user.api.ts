import { baseApi } from "@/core/store/api.store";
import { setUser, updateUserAvatar } from "./user.slice";
import { toast } from "sonner";
import type { User } from "../types/user.type";
import { USER_TAG } from "@/core/store/constants.store";
import type { ApiError } from "@/shared/model/api-error.types";
import { extractErrorMessageFromBackendError } from "@/shared/lib/errors.lib";

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
        } catch (action: unknown) {
          const errorMessage = extractErrorMessageFromBackendError(
            (action as { error: { data: ApiError } }).error as {
              data: ApiError;
            }
          );

          toast.error("Failed to update avatar: " + errorMessage);
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
      invalidatesTags: [USER_TAG],
      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          toast.success("User updated successfully");
          dispatch(setUser(data));
        } catch (action: unknown) {
          const errorMessage = extractErrorMessageFromBackendError(
            (action as { error: { data: ApiError } }).error as {
              data: ApiError;
            }
          );

          toast.error("Failed to update user: " + errorMessage);
        }
      },
    }),
  }),
});

export const { useUpdateAvatarMutation, useUpdateUserMutation } = userApi;
