import { baseApi } from "@core/store/api.store";
import { CHANNEL_TAG } from "@core/store/constants.store";
import {
  channelsResponseSchema,
  type Channel,
} from "../schemas/channel.schema";

export const channelApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getActiveChannels: builder.query<Channel[], void>({
      query: () => "/channels",
      transformResponse: (response: unknown) => {
        return channelsResponseSchema.parse(response);
      },
      providesTags: [CHANNEL_TAG],
    }),
  }),
});

export const { useGetActiveChannelsQuery } = channelApi;
