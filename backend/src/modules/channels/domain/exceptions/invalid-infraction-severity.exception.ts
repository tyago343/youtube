export class InvalidInfractionSeverityException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidInfractionSeverityException';
  }
}
