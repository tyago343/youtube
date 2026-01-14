import { ChannelStatusChange } from 'src/modules/channels/domain/channel-status-change.entity';
import { ChannelStatusChangeSchema } from '../entities/channel-status-change.schema';
import { ChannelId } from 'src/modules/channels/domain/vo/channel-id.vo';
import { UserId } from 'src/modules/users/domain/vo/user-id.vo';

export class ChannelStatusChangeMapper {
  static toPersistence(
    statusChange: ChannelStatusChange,
  ): ChannelStatusChangeSchema {
    const schema = new ChannelStatusChangeSchema();
    const primitives = statusChange.toPrimitives();

    schema.id = primitives.id;
    schema.channelId = primitives.channelId;
    schema.fromStatus = primitives.fromStatus;
    schema.toStatus = primitives.toStatus;
    schema.reason = primitives.reason;
    schema.severity = primitives.severity ?? undefined;
    schema.expiresAt = primitives.expiresAt ?? undefined;
    schema.createdAt = primitives.createdAt;
    schema.createdBy = primitives.createdBy ?? undefined;

    return schema;
  }

  static toDomain(schema: ChannelStatusChangeSchema): ChannelStatusChange {
    return ChannelStatusChange.fromPersistence({
      id: schema.id,
      channelId: ChannelId.create(schema.channelId),
      fromStatus: schema.fromStatus,
      toStatus: schema.toStatus,
      reason: schema.reason,
      severity: schema.severity ?? null,
      expiresAt: schema.expiresAt ?? null,
      createdAt: schema.createdAt,
      createdBy: schema.createdBy ? UserId.create(schema.createdBy) : null,
    });
  }
}
