import { InvalidSanctionTypeException } from '../exceptions/invalid-sanction-type.exception';

export class SanctionType {
  public static readonly WARNING = new SanctionType('WARNING');
  public static readonly HIDE_CONTENT = new SanctionType('HIDE_CONTENT');
  public static readonly REMOVE_COMMENT_RIGHT = new SanctionType(
    'REMOVE_COMMENT_RIGHT',
  );
  public static readonly SUSPEND_ACCOUNT = new SanctionType('SUSPEND_ACCOUNT');
  public static readonly SUSPEND_CHANNEL = new SanctionType('SUSPEND_CHANNEL');
  public static readonly TERMINATE_CHANNEL = new SanctionType(
    'TERMINATE_CHANNEL',
  );
  public static readonly BAN_USER = new SanctionType('BAN_USER');
  public static readonly DISMISSED = new SanctionType('DISMISSED');

  private static readonly VALID_VALUES = [
    'WARNING',
    'HIDE_CONTENT',
    'REMOVE_COMMENT_RIGHT',
    'SUSPEND_ACCOUNT',
    'SUSPEND_CHANNEL',
    'TERMINATE_CHANNEL',
    'BAN_USER',
    'DISMISSED',
  ] as const;

  private constructor(public readonly value: string) {}

  static fromString(value: string): SanctionType {
    switch (value) {
      case 'WARNING':
        return SanctionType.WARNING;
      case 'HIDE_CONTENT':
        return SanctionType.HIDE_CONTENT;
      case 'REMOVE_COMMENT_RIGHT':
        return SanctionType.REMOVE_COMMENT_RIGHT;
      case 'SUSPEND_ACCOUNT':
        return SanctionType.SUSPEND_ACCOUNT;
      case 'SUSPEND_CHANNEL':
        return SanctionType.SUSPEND_CHANNEL;
      case 'TERMINATE_CHANNEL':
        return SanctionType.TERMINATE_CHANNEL;
      case 'BAN_USER':
        return SanctionType.BAN_USER;
      case 'DISMISSED':
        return SanctionType.DISMISSED;
      default:
        throw new InvalidSanctionTypeException(
          `Invalid sanction type: ${value}. Valid values are: ${SanctionType.VALID_VALUES.join(', ')}`,
        );
    }
  }

  requiresTarget(): boolean {
    return this.value !== 'DISMISSED';
  }

  isTemporary(): boolean {
    return this.value === 'SUSPEND_ACCOUNT' || this.value === 'SUSPEND_CHANNEL';
  }

  equals(other: SanctionType): boolean {
    return this.value === other.value;
  }
}
