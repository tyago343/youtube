import { Injectable } from '@nestjs/common';
import { ChannelRepository } from '../ports/channel.repository';
import { Channel } from '../../domain/channel.entity';

@Injectable()
export class GetActiveChannelsUseCase {
  constructor(private readonly channelRepository: ChannelRepository) {}

  async execute(): Promise<Channel[]> {
    return await this.channelRepository.findAllActive();
  }
}
