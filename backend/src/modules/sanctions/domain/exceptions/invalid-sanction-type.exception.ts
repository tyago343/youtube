export class InvalidSanctionTypeException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidSanctionTypeException';
  }
}
