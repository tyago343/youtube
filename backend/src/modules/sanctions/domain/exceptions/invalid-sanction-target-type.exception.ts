export class InvalidSanctionTargetTypeException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidSanctionTargetTypeException';
  }
}
