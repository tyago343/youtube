import { InvalidReportStatusException } from '../exceptions/invalid-report-status.exception';

export class ReportStatus {
  public static readonly PENDING = new ReportStatus('PENDING');
  public static readonly ASSIGNED = new ReportStatus('ASSIGNED');
  public static readonly IN_REVIEW = new ReportStatus('IN_REVIEW');
  public static readonly ESCALATED_TO_LEGAL = new ReportStatus(
    'ESCALATED_TO_LEGAL',
  );
  public static readonly RESOLVED = new ReportStatus('RESOLVED');
  public static readonly DISMISSED = new ReportStatus('DISMISSED');

  private static readonly VALID_VALUES = [
    'PENDING',
    'ASSIGNED',
    'IN_REVIEW',
    'ESCALATED_TO_LEGAL',
    'RESOLVED',
    'DISMISSED',
  ] as const;

  private constructor(public readonly value: string) {}

  static fromString(value: string): ReportStatus {
    switch (value) {
      case 'PENDING':
        return ReportStatus.PENDING;
      case 'ASSIGNED':
        return ReportStatus.ASSIGNED;
      case 'IN_REVIEW':
        return ReportStatus.IN_REVIEW;
      case 'ESCALATED_TO_LEGAL':
        return ReportStatus.ESCALATED_TO_LEGAL;
      case 'RESOLVED':
        return ReportStatus.RESOLVED;
      case 'DISMISSED':
        return ReportStatus.DISMISSED;
      default:
        throw new InvalidReportStatusException(
          `Invalid report status: ${value}. Valid values are: ${ReportStatus.VALID_VALUES.join(', ')}`,
        );
    }
  }

  isPending(): boolean {
    return this.value === 'PENDING';
  }

  isOpen(): boolean {
    return (
      this.value === 'PENDING' ||
      this.value === 'ASSIGNED' ||
      this.value === 'IN_REVIEW' ||
      this.value === 'ESCALATED_TO_LEGAL'
    );
  }

  isClosed(): boolean {
    return this.value === 'RESOLVED' || this.value === 'DISMISSED';
  }

  isEscalated(): boolean {
    return this.value === 'ESCALATED_TO_LEGAL';
  }

  equals(other: ReportStatus): boolean {
    return this.value === other.value;
  }
}
