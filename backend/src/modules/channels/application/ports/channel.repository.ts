import { Channel } from '../../domain/channel.entity';
import { ChannelId } from '../../domain/vo/channel-id.vo';
import { UserId } from 'src/modules/users/domain/vo/user-id.vo';

export abstract class ChannelRepository {
  abstract save(channel: Channel): Promise<Channel>;
  abstract findById(id: ChannelId): Promise<Channel | null>;
  abstract findByOwnerId(ownerId: UserId): Promise<Channel[]>;
  abstract findAll(): Promise<Channel[]>;
  abstract delete(id: ChannelId): Promise<void>;
}
