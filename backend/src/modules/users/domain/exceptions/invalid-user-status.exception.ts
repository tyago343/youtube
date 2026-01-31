export class InvalidUserStatusException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidUserStatusException';
  }
}
