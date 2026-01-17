import { Injectable } from '@nestjs/common';
import { ChannelRepository } from '../ports/channel.repository';
import { ChannelFactory } from '../../domain/factories/channel.factory';
import { UserId } from 'src/modules/users/domain/vo/user-id.vo';
import { Channel } from '../../domain/channel.entity';

@Injectable()
export class CreateChannelUseCase {
  constructor(
    private readonly channelFactory: ChannelFactory,
    private readonly channelRepository: ChannelRepository,
  ) {}

  async execute({
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
  }): Promise<Channel> {
    const channel = this.channelFactory.create({
      ownerId,
      name,
      description,
      avatarUrl,
      bannerUrl,
      isMonetizationEnabled,
    });
    return this.channelRepository.save(channel);
  }
}
