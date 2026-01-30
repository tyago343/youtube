import { InvalidSanctionTargetTypeException } from '../exceptions/invalid-sanction-target-type.exception';

export class SanctionTargetType {
  public static readonly CHANNEL = new SanctionTargetType('CHANNEL');
  public static readonly USER = new SanctionTargetType('USER');
  public static readonly VIDEO = new SanctionTargetType('VIDEO');
  public static readonly COMMENT = new SanctionTargetType('COMMENT');
  public static readonly PLAYLIST = new SanctionTargetType('PLAYLIST');

  private static readonly VALID_VALUES = [
    'CHANNEL',
    'USER',
    'VIDEO',
    'COMMENT',
    'PLAYLIST',
  ] as const;

  private constructor(public readonly value: string) {}

  static fromString(value: string): SanctionTargetType {
    switch (value) {
      case 'CHANNEL':
        return SanctionTargetType.CHANNEL;
      case 'USER':
        return SanctionTargetType.USER;
      case 'VIDEO':
        return SanctionTargetType.VIDEO;
      case 'COMMENT':
        return SanctionTargetType.COMMENT;
      case 'PLAYLIST':
        return SanctionTargetType.PLAYLIST;
      default:
        throw new InvalidSanctionTargetTypeException(
          `Invalid sanction target type: ${value}. Valid values are: ${SanctionTargetType.VALID_VALUES.join(', ')}`,
        );
    }
  }

  equals(other: SanctionTargetType): boolean {
    return this.value === other.value;
  }
}
