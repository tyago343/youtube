export class InvalidAvatarUrlException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidAvatarUrlException';
  }
}
