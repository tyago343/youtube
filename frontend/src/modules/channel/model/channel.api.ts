import { baseApi } from "@core/store/api.store";
import { CHANNEL_TAG } from "@core/store/constants.store";
import {
  channelSchema,
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
    getUserChannel: builder.query<Channel, string>({
      query: (channelId) => `/channels/${channelId}`,
      transformResponse: (response: unknown) => {
        return channelSchema.parse(response);
      },
      providesTags: (_result, _error, channelId) => [{ type: CHANNEL_TAG, id: channelId }],
    }),
  }),
});

export const { useGetActiveChannelsQuery, useGetUserChannelQuery } = channelApi;