import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChannelSchema } from '../entities/channel.schema';
import { ChannelRepository } from 'src/modules/channels/application/ports/channel.repository';
import { Channel } from 'src/modules/channels/domain/channel.entity';
import { ChannelId } from 'src/modules/channels/domain/vo/channel-id.vo';
import { ChannelStatus } from 'src/modules/channels/domain/vo/channel-status.vo';
import { UserId } from 'src/modules/users/domain/vo/user-id.vo';
import { ChannelMapper } from '../mappers/channel.mapper';

@Injectable()
export class OrmChannelRepository extends ChannelRepository {
  constructor(
    @InjectRepository(ChannelSchema)
    private readonly channelRepository: Repository<ChannelSchema>,
  ) {
    super();
  }

  async save(channel: Channel): Promise<Channel> {
    const schema = ChannelMapper.toPersistence(channel);
    const savedChannel = await this.channelRepository.save(schema);
    return ChannelMapper.toDomain(savedChannel);
  }

  async findById(id: ChannelId): Promise<Channel | null> {
    const schema = await this.channelRepository.findOne({
      where: { id: id.value },
    });
    return schema ? ChannelMapper.toDomain(schema) : null;
  }

  async findByOwnerId(ownerId: UserId): Promise<Channel[]> {
    const schemas = await this.channelRepository.find({
      where: { ownerId: ownerId.value },
      order: { createdAt: 'DESC' },
    });
    return schemas.map((schema) => ChannelMapper.toDomain(schema));
  }

  async findAll(): Promise<Channel[]> {
    const schemas = await this.channelRepository.find({
      order: { createdAt: 'DESC' },
    });
    return schemas.map((schema) => ChannelMapper.toDomain(schema));
  }

  async findAllByStatus(status: ChannelStatus): Promise<Channel[]> {
    const schemas = await this.channelRepository.find({
      where: { status: status.value },
      order: { createdAt: 'DESC' },
    });
    return schemas.map((schema) => ChannelMapper.toDomain(schema));
  }

  async findAllActive(): Promise<Channel[]> {
    return this.findAllByStatus(ChannelStatus.ACTIVE);
  }

  async delete(id: ChannelId): Promise<void> {
    await this.channelRepository.delete(id.value);
  }
}
