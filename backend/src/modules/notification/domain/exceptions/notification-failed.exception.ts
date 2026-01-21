export class NotificationFailedException extends Error {
  constructor(
    readonly channel: string,
    readonly recipient: string,
    readonly reason: string,
  ) {
    super(`Failed to send ${channel} notification to ${recipient}: ${reason}`);
    this.name = 'NotificationFailedException';
  }
}
