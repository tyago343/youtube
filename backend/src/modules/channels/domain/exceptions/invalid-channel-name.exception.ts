export class InvalidChannelNameException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidChannelNameException';
  }
}
