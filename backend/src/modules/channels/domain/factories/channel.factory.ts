import { randomUUID } from 'crypto';
import { Channel } from '../channel.entity';
import { UserId } from 'src/modules/users/domain/vo/user-id.vo';

export class ChannelFactory {
  create({
    ownerId,
    name,
    description,
    avatarUrl,
    bannerUrl,
    isMonetizationEnabled,
  }: {
    ownerId: UserId;
    name: string;
    description?: string;
    avatarUrl?: string;
    bannerUrl?: string;
    isMonetizationEnabled?: boolean;
  }): Channel {
    return Channel.create({
      id: randomUUID(),
      ownerId,
      name,
      description,
      avatarUrl,
      bannerUrl,
      isMonetizationEnabled,
    });
  }

  reconstitute({
    id,
    ownerId,
    name,
    description,
    createdAt,
    status,
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
    status: string;
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
      status,
      avatarUrl,
      bannerUrl,
      isMonetizationEnabled,
      updatedAt,
    });
  }
}
