import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { ChannelRepository } from '../ports/channel.repository';
import { ChannelStatusChangeRepository } from '../ports/channel-status-change.repository';
import { ChannelStatusChange } from '../../domain/channel-status-change.entity';
import { ChannelStatus } from '../../domain/vo/channel-status.vo';
import { ChannelId } from '../../domain/vo/channel-id.vo';

const AUTO_REACTIVATION_REASON =
  'Automatic reactivation: suspension period expired';

export interface ProcessedSuspension {
  channelId: string;
  previousStatus: string;
  newStatus: string;
}

@Injectable()
export class ProcessExpiredSuspensionsUseCase {
  constructor(
    private readonly channelRepository: ChannelRepository,
    private readonly statusChangeRepository: ChannelStatusChangeRepository,
  ) {}

  async execute(): Promise<ProcessedSuspension[]> {
    const expiredSuspensions =
      await this.statusChangeRepository.findExpiredSuspensions();

    const processed: ProcessedSuspension[] = [];

    for (const suspension of expiredSuspensions) {
      if (!suspension.canAutoReactivate()) {
        continue;
      }

      const channel = await this.channelRepository.findById(
        suspension.channelId,
      );

      if (!channel || !channel.isSuspended()) {
        continue;
      }

      const fromStatus = channel.status;
      channel.activate();
      await this.channelRepository.save(channel);

      const reactivationChange = ChannelStatusChange.create({
        id: uuidv4(),
        channelId: ChannelId.create(channel.id.value),
        fromStatus,
        toStatus: ChannelStatus.ACTIVE,
        reason: AUTO_REACTIVATION_REASON,
      });

      await this.statusChangeRepository.save(reactivationChange);

      processed.push({
        channelId: channel.id.value,
        previousStatus: fromStatus.value,
        newStatus: ChannelStatus.ACTIVE.value,
      });
    }

    return processed;
  }
}
