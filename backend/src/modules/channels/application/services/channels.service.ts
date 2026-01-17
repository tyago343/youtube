import { Injectable, NotFoundException } from '@nestjs/common';
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
import { ChannelNotFoundException } from '../../domain/exceptions/channel-not-found.exception';
import { CreateChannelUseCase } from '../use-cases/create-channel.use-case';
import { UserId } from 'src/modules/users/domain/vo/user-id.vo';

@Injectable()
export class ChannelsService {
  constructor(
    private readonly createChannelUseCase: CreateChannelUseCase,
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
    return await this.createChannelUseCase.execute(data);
  }
  async getActiveChannels(): Promise<Channel[]> {
    return await this.getActiveChannelsUseCase.execute();
  }

  async suspendChannel(
    input: SuspendChannelInput,
  ): Promise<SuspendChannelOutput> {
    try {
      return await this.suspendChannelUseCase.execute(input);
    } catch (error) {
      if (error instanceof ChannelNotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  async reactivateChannel(
    input: ReactivateChannelInput,
  ): Promise<ReactivateChannelOutput> {
    try {
      return await this.reactivateChannelUseCase.execute(input);
    } catch (error) {
      if (error instanceof ChannelNotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  async processExpiredSuspensions(): Promise<ProcessedSuspension[]> {
    return await this.processExpiredSuspensionsUseCase.execute();
  }

  async getChannelStatusHistory(
    channelId: string,
  ): Promise<ChannelStatusChange[]> {
    return await this.getChannelStatusHistoryUseCase.execute(channelId);
  }
}
