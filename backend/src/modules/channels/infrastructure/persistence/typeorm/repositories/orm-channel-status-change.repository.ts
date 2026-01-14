import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, Repository } from 'typeorm';
import { ChannelStatusChangeSchema } from '../entities/channel-status-change.schema';
import { ChannelStatusChangeRepository } from 'src/modules/channels/application/ports/channel-status-change.repository';
import { ChannelStatusChange } from 'src/modules/channels/domain/channel-status-change.entity';
import { ChannelId } from 'src/modules/channels/domain/vo/channel-id.vo';
import { ChannelStatusChangeMapper } from '../mappers/channel-status-change.mapper';

@Injectable()
export class OrmChannelStatusChangeRepository extends ChannelStatusChangeRepository {
  constructor(
    @InjectRepository(ChannelStatusChangeSchema)
    private readonly repository: Repository<ChannelStatusChangeSchema>,
  ) {
    super();
  }

  async save(statusChange: ChannelStatusChange): Promise<ChannelStatusChange> {
    const schema = ChannelStatusChangeMapper.toPersistence(statusChange);
    const saved = await this.repository.save(schema);
    return ChannelStatusChangeMapper.toDomain(saved);
  }

  async findByChannelId(channelId: ChannelId): Promise<ChannelStatusChange[]> {
    const schemas = await this.repository.find({
      where: { channelId: channelId.value },
      order: { createdAt: 'DESC' },
    });
    return schemas.map((schema) => ChannelStatusChangeMapper.toDomain(schema));
  }

  async findLatestByChannelId(
    channelId: ChannelId,
  ): Promise<ChannelStatusChange | null> {
    const schema = await this.repository.findOne({
      where: { channelId: channelId.value },
      order: { createdAt: 'DESC' },
    });
    return schema ? ChannelStatusChangeMapper.toDomain(schema) : null;
  }

  async findExpiredSuspensions(): Promise<ChannelStatusChange[]> {
    const now = new Date();
    const schemas = await this.repository.find({
      where: {
        toStatus: 'SUSPENDED',
        severity: 'MINOR',
        expiresAt: LessThanOrEqual(now),
      },
      order: { createdAt: 'ASC' },
    });
    return schemas.map((schema) => ChannelStatusChangeMapper.toDomain(schema));
  }

  async findPendingReviews(): Promise<ChannelStatusChange[]> {
    const schemas = await this.repository.find({
      where: { toStatus: 'PENDING_REVIEW' },
      order: { createdAt: 'ASC' },
    });
    return schemas.map((schema) => ChannelStatusChangeMapper.toDomain(schema));
  }
}
