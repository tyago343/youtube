export class RefreshToken {
  constructor(public readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('Refresh token cannot be empty');
    }
  }
  static create(value: string): RefreshToken {
    return new RefreshToken(value);
  }
}
