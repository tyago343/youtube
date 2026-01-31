import { InvalidReportableTypeException } from '../exceptions/invalid-reportable-type.exception';

export class ReportableType {
  public static readonly CHANNEL = new ReportableType('CHANNEL');
  public static readonly VIDEO = new ReportableType('VIDEO');
  public static readonly COMMENT = new ReportableType('COMMENT');
  public static readonly PLAYLIST = new ReportableType('PLAYLIST');
  public static readonly USER = new ReportableType('USER');

  private static readonly VALID_VALUES = [
    'CHANNEL',
    'VIDEO',
    'COMMENT',
    'PLAYLIST',
    'USER',
  ] as const;

  private constructor(public readonly value: string) {}

  static fromString(value: string): ReportableType {
    switch (value) {
      case 'CHANNEL':
        return ReportableType.CHANNEL;
      case 'VIDEO':
        return ReportableType.VIDEO;
      case 'COMMENT':
        return ReportableType.COMMENT;
      case 'PLAYLIST':
        return ReportableType.PLAYLIST;
      case 'USER':
        return ReportableType.USER;
      default:
        throw new InvalidReportableTypeException(
          `Invalid reportable type: ${value}. Valid values are: ${ReportableType.VALID_VALUES.join(', ')}`,
        );
    }
  }

  equals(other: ReportableType): boolean {
    return this.value === other.value;
  }
}
