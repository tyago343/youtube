import { randomUUID } from 'crypto';
import { Channel } from '../channel.entity';
import { UserId } from 'src/modules/users/domain/vo/user-id.vo';

export class ChannelFactory {
  create({
    ownerId,
    name,
    description,
  }: {
    ownerId: UserId;
    name: string;
    description?: string;
  }): Channel {
    return Channel.create({
      id: randomUUID(),
      ownerId,
      name,
      description,
    });
  }

  reconstitute({
    id,
    ownerId,
    name,
    description,
    createdAt,
    avatarUrl,
    bannerUrl,
    isMonetizationEnabled,
    updatedAt,
  }: {
    id: string;
    ownerId: UserId;
    name: string;
    description: string;
    createdAt: Date;
    avatarUrl?: string;
    bannerUrl?: string;
    isMonetizationEnabled: boolean;
    updatedAt?: Date;
  }): Channel {
    return Channel.fromPersistence({
      id,
      ownerId,
      name,
      description,
      createdAt,
      avatarUrl,
      bannerUrl,
      isMonetizationEnabled,
      updatedAt,
    });
  }
}
