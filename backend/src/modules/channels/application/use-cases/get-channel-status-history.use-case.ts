import { Injectable } from '@nestjs/common';
import { ChannelStatusChangeRepository } from '../ports/channel-status-change.repository';
import { ChannelStatusChange } from '../../domain/channel-status-change.entity';
import { ChannelId } from '../../domain/vo/channel-id.vo';

@Injectable()
export class GetChannelStatusHistoryUseCase {
  constructor(
    private readonly statusChangeRepository: ChannelStatusChangeRepository,
  ) {}

  async execute(channelId: string): Promise<ChannelStatusChange[]> {
    return await this.statusChangeRepository.findByChannelId(
      ChannelId.create(channelId),
    );
  }
}
