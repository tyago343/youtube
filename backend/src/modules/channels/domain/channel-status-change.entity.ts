import { ChannelId } from './vo/channel-id.vo';
import { ChannelStatus } from './vo/channel-status.vo';
import { ChannelStatusChangeId } from './vo/channel-status-change-id.vo';
import { InfractionSeverity } from './vo/infraction-severity.vo';
import { UserId } from 'src/modules/users/domain/vo/user-id.vo';

export class ChannelStatusChange {
  private constructor({
    id,
    channelId,
    fromStatus,
    toStatus,
    reason,
    severity,
    expiresAt,
    createdAt,
    createdBy,
  }: {
    id: ChannelStatusChangeId;
    channelId: ChannelId;
    fromStatus: ChannelStatus;
    toStatus: ChannelStatus;
    reason: string;
    severity: InfractionSeverity | null;
    expiresAt: Date | null;
    createdAt: Date;
    createdBy: UserId | null;
  }) {
    this.id = id;
    this.channelId = channelId;
    this.fromStatus = fromStatus;
    this.toStatus = toStatus;
    this.reason = reason;
    this.severity = severity;
    this.expiresAt = expiresAt;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
  }

  public readonly id: ChannelStatusChangeId;
  public readonly channelId: ChannelId;
  public readonly fromStatus: ChannelStatus;
  public readonly toStatus: ChannelStatus;
  public readonly reason: string;
  public readonly severity: InfractionSeverity | null;
  public readonly expiresAt: Date | null;
  public readonly createdAt: Date;
  public readonly createdBy: UserId | null;

  static create({
    id,
    channelId,
    fromStatus,
    toStatus,
    reason,
    severity = null,
    expiresAt = null,
    createdBy = null,
  }: {
    id: string;
    channelId: ChannelId;
    fromStatus: ChannelStatus;
    toStatus: ChannelStatus;
    reason: string;
    severity?: InfractionSeverity | null;
    expiresAt?: Date | null;
    createdBy?: UserId | null;
  }): ChannelStatusChange {
    return new ChannelStatusChange({
      id: ChannelStatusChangeId.create(id),
      channelId,
      fromStatus,
      toStatus,
      reason,
      severity,
      expiresAt,
      createdAt: new Date(),
      createdBy,
    });
  }

  static fromPersistence({
    id,
    channelId,
    fromStatus,
    toStatus,
    reason,
    severity,
    expiresAt,
    createdAt,
    createdBy,
  }: {
    id: string;
    channelId: ChannelId;
    fromStatus: string;
    toStatus: string;
    reason: string;
    severity: string | null;
    expiresAt: Date | null;
    createdAt: Date;
    createdBy: UserId | null;
  }): ChannelStatusChange {
    return new ChannelStatusChange({
      id: ChannelStatusChangeId.create(id),
      channelId,
      fromStatus: ChannelStatus.fromString(fromStatus),
      toStatus: ChannelStatus.fromString(toStatus),
      reason,
      severity: severity ? InfractionSeverity.fromString(severity) : null,
      expiresAt,
      createdAt,
      createdBy,
    });
  }

  isExpired(): boolean {
    if (!this.expiresAt) {
      return false;
    }
    return new Date() >= this.expiresAt;
  }

  isSuspension(): boolean {
    return this.toStatus.equals(ChannelStatus.SUSPENDED);
  }

  canAutoReactivate(): boolean {
    return (
      this.isSuspension() &&
      this.severity !== null &&
      this.severity.canAutoReactivate() &&
      this.isExpired()
    );
  }

  requiresManualReview(): boolean {
    return this.severity !== null && this.severity.requiresManualReview();
  }

  toPrimitives() {
    return {
      id: this.id.value,
      channelId: this.channelId.value,
      fromStatus: this.fromStatus.value,
      toStatus: this.toStatus.value,
      reason: this.reason,
      severity: this.severity?.value ?? null,
      expiresAt: this.expiresAt,
      createdAt: this.createdAt,
      createdBy: this.createdBy?.value ?? null,
    };
  }
}
