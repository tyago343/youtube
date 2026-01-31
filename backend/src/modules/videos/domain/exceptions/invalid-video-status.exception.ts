export class InvalidVideoStatusException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidVideoStatusException';
  }
}
