export class ChannelNotFoundException extends Error {
  constructor(message: string = 'Channel not found') {
    super(message);
    this.name = 'ChannelNotFoundException';
  }
}
