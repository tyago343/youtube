export class InvalidSanctionTargetException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidSanctionTargetException';
  }
}
