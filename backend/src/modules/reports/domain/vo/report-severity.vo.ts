import { InvalidReportSeverityException } from '../exceptions/invalid-report-severity.exception';

export class ReportSeverity {
  public static readonly LOW = new ReportSeverity('LOW');
  public static readonly MEDIUM = new ReportSeverity('MEDIUM');
  public static readonly HIGH = new ReportSeverity('HIGH');
  public static readonly CRITICAL = new ReportSeverity('CRITICAL');

  private static readonly VALID_VALUES = [
    'LOW',
    'MEDIUM',
    'HIGH',
    'CRITICAL',
  ] as const;

  private constructor(public readonly value: string) {}

  static fromString(value: string): ReportSeverity {
    switch (value) {
      case 'LOW':
        return ReportSeverity.LOW;
      case 'MEDIUM':
        return ReportSeverity.MEDIUM;
      case 'HIGH':
        return ReportSeverity.HIGH;
      case 'CRITICAL':
        return ReportSeverity.CRITICAL;
      default:
        throw new InvalidReportSeverityException(
          `Invalid report severity: ${value}. Valid values are: ${ReportSeverity.VALID_VALUES.join(', ')}`,
        );
    }
  }

  requiresUrgentAttention(): boolean {
    return this.value === 'HIGH' || this.value === 'CRITICAL';
  }

  requiresLegalReview(): boolean {
    return this.value === 'CRITICAL';
  }

  equals(other: ReportSeverity): boolean {
    return this.value === other.value;
  }
}
