export class InvalidUsernameException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidUsernameException';
  }
}
