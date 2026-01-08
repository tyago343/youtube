import { toast } from "sonner";
import { baseApi } from "@core/store/api.store";
import { USER_TAG } from "@core/store/constants.store";
import { apiErrorSchema } from "@shared/model/api-error.schema";
import { extractErrorMessageFromBackendError } from "@shared/lib/errors.lib";
import { setUser, updateUserAvatar } from "./user.slice";
import { userSchema, type User } from "../schemas/user.schema";
import {
  updateAvatarResponseSchema,
  type UpdateAvatarResponse,
} from "../schemas/update-avatar-response.schema";

function isApiError(error: unknown): error is { data: unknown } {
  return typeof error === "object" && error !== null && "data" in error;
}

function extractApiError(error: unknown): string {
  if (!isApiError(error)) {
    return "An unknown error occurred";
  }

  const parseResult = apiErrorSchema.safeParse(error.data);
  if (parseResult.success) {
    return extractErrorMessageFromBackendError({ data: parseResult.data });
  }

  return "An unknown error occurred";
}

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    updateAvatar: builder.mutation<
      UpdateAvatarResponse,
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
      transformResponse: (response: unknown) => {
        return updateAvatarResponseSchema.parse(response);
      },
      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          toast.success("Avatar updated successfully");
          dispatch(updateUserAvatar(data.avatarUrl));
        } catch (error) {
          const errorMessage = extractApiError(error);
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
      transformResponse: (response: unknown) => {
        return userSchema.parse(response);
      },
      invalidatesTags: [USER_TAG],
      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          toast.success("User updated successfully");
          dispatch(setUser(data));
        } catch (error) {
          const errorMessage = extractApiError(error);
          toast.error("Failed to update user: " + errorMessage);
        }
      },
    }),
  }),
});

export const { useUpdateAvatarMutation, useUpdateUserMutation } = userApi;
