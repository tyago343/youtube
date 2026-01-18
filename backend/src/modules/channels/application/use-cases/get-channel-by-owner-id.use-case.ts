import { Injectable } from '@nestjs/common';
import { Channel } from '../../domain/channel.entity';
import { ChannelRepository } from '../ports/channel.repository';
import { UserId } from 'src/modules/users/domain/vo/user-id.vo';

@Injectable()
export class GetChannelByOwnerIdUseCase {
  constructor(private readonly channelRepository: ChannelRepository) {}
  async execute(ownerId: string): Promise<Channel[]> {
    const userId = UserId.create(ownerId);
    return this.channelRepository.findByOwnerId(userId);
  }
}
