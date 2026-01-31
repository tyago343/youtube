export class InvalidReportIdException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidReportIdException';
  }
}
