export class InvalidReportableTypeException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidReportableTypeException';
  }
}
