export class InvalidVideoVisibilityException extends Error {
  constructor(message: string = 'Invalid video visibility') {
    super(message);
    this.name = 'InvalidVideoVisibilityException';
  }
}
