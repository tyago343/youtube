import { ChannelStatusChange } from '../../domain/channel-status-change.entity';
import { ChannelId } from '../../domain/vo/channel-id.vo';

export abstract class ChannelStatusChangeRepository {
  abstract save(
    statusChange: ChannelStatusChange,
  ): Promise<ChannelStatusChange>;
  abstract findByChannelId(
    channelId: ChannelId,
  ): Promise<ChannelStatusChange[]>;
  abstract findLatestByChannelId(
    channelId: ChannelId,
  ): Promise<ChannelStatusChange | null>;
  abstract findExpiredSuspensions(): Promise<ChannelStatusChange[]>;
  abstract findPendingReviews(): Promise<ChannelStatusChange[]>;
}
