export class InvalidChannelStatusException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidChannelStatusException';
  }
}
