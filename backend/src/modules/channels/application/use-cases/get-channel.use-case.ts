import { Injectable } from '@nestjs/common';
import { Channel } from '../../domain/channel.entity';
import { ChannelRepository } from '../ports/channel.repository';
import { ChannelNotFoundException } from '../../domain/exceptions/channel-not-found.exception';
import { ChannelId } from '../../domain/vo/channel-id.vo';

@Injectable()
export class GetChannelUseCase {
  constructor(private readonly channelRepository: ChannelRepository) {}

  async execute(id: string): Promise<Channel> {
    const channelId = ChannelId.create(id);
    const channel = await this.channelRepository.findById(channelId);
    if (!channel) {
      throw new ChannelNotFoundException(channelId.value);
    }
    return channel;
  }
}
