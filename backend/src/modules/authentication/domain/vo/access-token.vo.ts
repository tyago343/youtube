export class AccessToken {
  constructor(public readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('Access token cannot be empty');
    }
  }
  static create(value: string): AccessToken {
    return new AccessToken(value);
  }
}
