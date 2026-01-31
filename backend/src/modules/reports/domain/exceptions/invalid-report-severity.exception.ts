export class InvalidReportSeverityException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidReportSeverityException';
  }
}
