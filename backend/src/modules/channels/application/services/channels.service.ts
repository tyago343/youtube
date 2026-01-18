import { Injectable } from '@nestjs/common';
import { GetActiveChannelsUseCase } from '../use-cases/get-active-channels.use-case';
import {
  SuspendChannelUseCase,
  SuspendChannelInput,
  SuspendChannelOutput,
} from '../use-cases/suspend-channel.use-case';
import {
  ReactivateChannelUseCase,
  ReactivateChannelInput,
  ReactivateChannelOutput,
} from '../use-cases/reactivate-channel.use-case';
import {
  ProcessExpiredSuspensionsUseCase,
  ProcessedSuspension,
} from '../use-cases/process-expired-suspensions.use-case';
import { GetChannelStatusHistoryUseCase } from '../use-cases/get-channel-status-history.use-case';
import { Channel } from '../../domain/channel.entity';
import { ChannelStatusChange } from '../../domain/channel-status-change.entity';
import { CreateChannelUseCase } from '../use-cases/create-channel.use-case';
import { UserId } from 'src/modules/users/domain/vo/user-id.vo';
import { GetChannelUseCase } from '../use-cases/get-channel.use-case';

@Injectable()
export class ChannelsService {
  constructor(
    private readonly createChannelUseCase: CreateChannelUseCase,
    private readonly getChannelUseCase: GetChannelUseCase,
    private readonly getActiveChannelsUseCase: GetActiveChannelsUseCase,
    private readonly suspendChannelUseCase: SuspendChannelUseCase,
    private readonly reactivateChannelUseCase: ReactivateChannelUseCase,
    private readonly processExpiredSuspensionsUseCase: ProcessExpiredSuspensionsUseCase,
    private readonly getChannelStatusHistoryUseCase: GetChannelStatusHistoryUseCase,
  ) {}

  async create(data: {
    ownerId: UserId;
    name: string;
    description?: string;
    avatarUrl?: string;
    bannerUrl?: string;
    isMonetizationEnabled?: boolean;
  }): Promise<Channel> {
    return this.createChannelUseCase.execute(data);
  }

  async getChannel(id: string): Promise<Channel> {
    return this.getChannelUseCase.execute(id);
  }

  async getActiveChannels(): Promise<Channel[]> {
    return this.getActiveChannelsUseCase.execute();
  }

  async suspendChannel(
    input: SuspendChannelInput,
  ): Promise<SuspendChannelOutput> {
    return this.suspendChannelUseCase.execute(input);
  }

  async reactivateChannel(
    input: ReactivateChannelInput,
  ): Promise<ReactivateChannelOutput> {
    return this.reactivateChannelUseCase.execute(input);
  }
  async processExpiredSuspensions(): Promise<ProcessedSuspension[]> {
    return this.processExpiredSuspensionsUseCase.execute();
  }

  async getChannelStatusHistory(
    channelId: string,
  ): Promise<ChannelStatusChange[]> {
    return this.getChannelStatusHistoryUseCase.execute(channelId);
  }
}
