export class InvalidVideoIdException extends Error {
  constructor(message: string = 'Invalid video ID') {
    super(message);
    this.name = 'InvalidVideoIdException';
  }
}
