import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { ChannelRepository } from '../ports/channel.repository';
import { ChannelStatusChangeRepository } from '../ports/channel-status-change.repository';
import { ChannelStatusChange } from '../../domain/channel-status-change.entity';
import { ChannelStatus } from '../../domain/vo/channel-status.vo';
import { InfractionSeverity } from '../../domain/vo/infraction-severity.vo';
import { ChannelId } from '../../domain/vo/channel-id.vo';
import { UserId } from 'src/modules/users/domain/vo/user-id.vo';
import { ChannelNotFoundException } from '../../domain/exceptions/channel-not-found.exception';
import { Channel } from '../../domain/channel.entity';

export interface SuspendChannelInput {
  channelId: string;
  reason: string;
  severity: string;
  suspendedBy?: string;
}

export interface SuspendChannelOutput {
  channel: Channel;
  statusChange: ChannelStatusChange;
}

@Injectable()
export class SuspendChannelUseCase {
  constructor(
    private readonly channelRepository: ChannelRepository,
    private readonly statusChangeRepository: ChannelStatusChangeRepository,
  ) {}

  async execute(input: SuspendChannelInput): Promise<SuspendChannelOutput> {
    const channelId = ChannelId.create(input.channelId);
    const channel = await this.channelRepository.findById(channelId);

    if (!channel) {
      throw new ChannelNotFoundException(
        `Channel not found: ${input.channelId}`,
      );
    }

    const fromStatus = channel.status;
    const severity = InfractionSeverity.fromString(input.severity);
    const expiresAt = severity.calculateExpirationDate();

    channel.suspend();
    await this.channelRepository.save(channel);

    const statusChange = ChannelStatusChange.create({
      id: uuidv4(),
      channelId,
      fromStatus,
      toStatus: ChannelStatus.SUSPENDED,
      reason: input.reason,
      severity,
      expiresAt,
      createdBy: input.suspendedBy ? UserId.create(input.suspendedBy) : null,
    });

    const savedStatusChange =
      await this.statusChangeRepository.save(statusChange);

    return {
      channel,
      statusChange: savedStatusChange,
    };
  }
}
