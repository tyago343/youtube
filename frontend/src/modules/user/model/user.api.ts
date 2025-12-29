import { baseApi } from "@/core/store/api.store";
import { updateUserAvatar } from "./user.slice";
import { toast } from "sonner";

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
          dispatch(updateUserAvatar(data.avatarUrl));
        } catch (error) {
          toast.error("Failed to update avatar: " + error);
        }
      },
    }),
  }),
});

export const { useUpdateAvatarMutation } = userApi;
