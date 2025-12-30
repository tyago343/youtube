export class VideoNotFoundException extends Error {
  constructor(message: string = 'Video not found') {
    super(message);
    this.name = 'VideoNotFoundException';
  }
}
