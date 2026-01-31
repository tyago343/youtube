import { InvalidUserStatusException } from '../exceptions/invalid-user-status.exception';

export class UserStatus {
  public static readonly ACTIVE = new UserStatus('ACTIVE');
  public static readonly SANCTIONED = new UserStatus('SANCTIONED');
  public static readonly BANNED = new UserStatus('BANNED');
  public static readonly INACTIVE = new UserStatus('INACTIVE');

  private static readonly VALID_VALUES = [
    'ACTIVE',
    'SANCTIONED',
    'BANNED',
    'INACTIVE',
  ] as const;

  private constructor(public readonly value: string) {}

  static fromString(value: string): UserStatus {
    switch (value) {
      case 'ACTIVE':
        return UserStatus.ACTIVE;
      case 'SANCTIONED':
        return UserStatus.SANCTIONED;
      case 'BANNED':
        return UserStatus.BANNED;
      case 'INACTIVE':
        return UserStatus.INACTIVE;
      default:
        throw new InvalidUserStatusException(
          `Invalid user status: ${value}. Valid values are: ${UserStatus.VALID_VALUES.join(', ')}`,
        );
    }
  }

  isActive(): boolean {
    return this.value === 'ACTIVE';
  }

  isSanctioned(): boolean {
    return this.value === 'SANCTIONED';
  }

  isBanned(): boolean {
    return this.value === 'BANNED';
  }

  canAuthenticate(): boolean {
    return this.value !== 'BANNED';
  }

  isInactive(): boolean {
    return this.value === 'INACTIVE';
  }

  equals(other: UserStatus): boolean {
    return this.value === other.value;
  }
}
