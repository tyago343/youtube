import { InvalidInfractionSeverityException } from '../exceptions/invalid-infraction-severity.exception';

const MINOR_SUSPENSION_DAYS = 5;
const MAJOR_SUSPENSION_DAYS = 30;

export class InfractionSeverity {
  public static readonly MINOR = new InfractionSeverity('MINOR');
  public static readonly MAJOR = new InfractionSeverity('MAJOR');
  public static readonly SEVERE = new InfractionSeverity('SEVERE');

  private static readonly VALID_VALUES = ['MINOR', 'MAJOR', 'SEVERE'] as const;

  private constructor(public readonly value: string) {}

  static fromString(value: string): InfractionSeverity {
    switch (value) {
      case 'MINOR':
        return InfractionSeverity.MINOR;
      case 'MAJOR':
        return InfractionSeverity.MAJOR;
      case 'SEVERE':
        return InfractionSeverity.SEVERE;
      default:
        throw new InvalidInfractionSeverityException(
          `Invalid infraction severity: ${value}. Valid values are: ${InfractionSeverity.VALID_VALUES.join(', ')}`,
        );
    }
  }

  requiresManualReview(): boolean {
    return this.value === 'SEVERE';
  }

  canAutoReactivate(): boolean {
    return this.value === 'MINOR' || this.value === 'MAJOR';
  }

  getSuspensionDurationDays(): number | null {
    switch (this.value) {
      case 'MINOR':
        return MINOR_SUSPENSION_DAYS;
      case 'MAJOR':
        return MAJOR_SUSPENSION_DAYS;
      case 'SEVERE':
        return null; // Permanent until review
      default:
        return null;
    }
  }

  calculateExpirationDate(fromDate: Date = new Date()): Date | null {
    const days = this.getSuspensionDurationDays();
    if (days === null) {
      return null;
    }
    const expirationDate = new Date(fromDate);
    expirationDate.setDate(expirationDate.getDate() + days);
    return expirationDate;
  }

  equals(other: InfractionSeverity): boolean {
    return this.value === other.value;
  }
}
