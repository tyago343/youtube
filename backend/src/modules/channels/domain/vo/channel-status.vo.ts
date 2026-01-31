import { InvalidChannelStatusException } from '../exceptions/invalid-channel-status.exception';

export class ChannelStatus {
  public static readonly ACTIVE = new ChannelStatus('ACTIVE');
  public static readonly SUSPENDED = new ChannelStatus('SUSPENDED');
  public static readonly SANCTIONED = new ChannelStatus('SANCTIONED');
  public static readonly TERMINATED = new ChannelStatus('TERMINATED');
  public static readonly INACTIVE = new ChannelStatus('INACTIVE');
  public static readonly PENDING_REVIEW = new ChannelStatus('PENDING_REVIEW');

  private static readonly VALID_VALUES = [
    'ACTIVE',
    'SUSPENDED',
    'SANCTIONED',
    'TERMINATED',
    'INACTIVE',
    'PENDING_REVIEW',
  ] as const;

  private constructor(public readonly value: string) {}

  static fromString(value: string): ChannelStatus {
    switch (value) {
      case 'ACTIVE':
        return ChannelStatus.ACTIVE;
      case 'SUSPENDED':
        return ChannelStatus.SUSPENDED;
      case 'SANCTIONED':
        return ChannelStatus.SANCTIONED;
      case 'TERMINATED':
        return ChannelStatus.TERMINATED;
      case 'INACTIVE':
        return ChannelStatus.INACTIVE;
      case 'PENDING_REVIEW':
        return ChannelStatus.PENDING_REVIEW;
      default:
        throw new InvalidChannelStatusException(
          `Invalid channel status: ${value}. Valid values are: ${ChannelStatus.VALID_VALUES.join(', ')}`,
        );
    }
  }

  isPubliclyVisible(): boolean {
    return this.value === 'ACTIVE';
  }

  canBeReactivated(): boolean {
    return (
      this.value === 'SUSPENDED' ||
      this.value === 'SANCTIONED' ||
      this.value === 'INACTIVE'
    );
  }

  canBeSuspended(): boolean {
    return this.value === 'ACTIVE';
  }

  canBeSanctioned(): boolean {
    return this.value === 'ACTIVE' || this.value === 'SUSPENDED';
  }

  canBeTerminated(): boolean {
    return this.value !== 'TERMINATED';
  }

  requiresReview(): boolean {
    return this.value === 'PENDING_REVIEW';
  }

  isSanctioned(): boolean {
    return this.value === 'SANCTIONED';
  }

  equals(other: ChannelStatus): boolean {
    return this.value === other.value;
  }
}
