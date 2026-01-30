import { InvalidUserRoleException } from '../exceptions/invalid-user-role.exception';

export class UserRole {
  public static readonly USER = new UserRole('USER');
  public static readonly MODERATOR = new UserRole('MODERATOR');
  public static readonly LEGAL = new UserRole('LEGAL');

  private static readonly VALID_VALUES = [
    'USER',
    'MODERATOR',
    'LEGAL',
  ] as const;

  private constructor(public readonly value: string) {}

  static fromString(value: string): UserRole {
    switch (value) {
      case 'USER':
        return UserRole.USER;
      case 'MODERATOR':
        return UserRole.MODERATOR;
      case 'LEGAL':
        return UserRole.LEGAL;
      default:
        throw new InvalidUserRoleException(
          `Invalid user role: ${value}. Valid values are: ${UserRole.VALID_VALUES.join(', ')}`,
        );
    }
  }

  isModerator(): boolean {
    return this.value === 'MODERATOR' || this.value === 'LEGAL';
  }

  isLegal(): boolean {
    return this.value === 'LEGAL';
  }

  equals(other: UserRole): boolean {
    return this.value === other.value;
  }
}
