import { validate as uuidValidate } from 'uuid';
import { InvalidReportIdException } from '../exceptions/invalid-report-id.exception';

export class ReportId {
  private constructor(public readonly value: string) {
    this.validate(value);
  }

  static create(id: string): ReportId {
    return new ReportId(id);
  }

  private validate(id: string): void {
    if (!id || id.trim().length === 0) {
      throw new InvalidReportIdException('Report ID cannot be empty');
    }

    if (!uuidValidate(id)) {
      throw new InvalidReportIdException(`Invalid report ID format: ${id}`);
    }
  }

  equals(other: ReportId): boolean {
    return this.value === other.value;
  }
}
