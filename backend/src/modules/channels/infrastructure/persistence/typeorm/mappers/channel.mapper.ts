import { Channel } from 'src/modules/channels/domain/channel.entity';
import { ChannelSchema } from '../entities/channel.schema';
import { UserId } from 'src/modules/users/domain/vo/user-id.vo';

export class ChannelMapper {
  static toPersistence(channel: Channel): ChannelSchema {
    const schema = new ChannelSchema();
    const primitives = channel.toPrimitives();

    schema.id = primitives.id;
    schema.ownerId = primitives.ownerId;
    schema.name = primitives.name;
    schema.description = primitives.description;
    schema.status = primitives.status;
    schema.avatarUrl = primitives.avatarUrl;
    schema.bannerUrl = primitives.bannerUrl;
    schema.isMonetizationEnabled = primitives.isMonetizationEnabled;
    schema.createdAt = primitives.createdAt;
    schema.updatedAt = primitives.updatedAt;

    return schema;
  }

  static toDomain(schema: ChannelSchema): Channel {
    return Channel.fromPersistence({
      id: schema.id,
      ownerId: UserId.create(schema.ownerId),
      name: schema.name,
      description: schema.description,
      status: schema.status,
      avatarUrl: schema.avatarUrl,
      bannerUrl: schema.bannerUrl,
      isMonetizationEnabled: schema.isMonetizationEnabled,
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
    });
  }
}
