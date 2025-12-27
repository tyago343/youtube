import { InvalidUsernameException } from '../exceptions/invalid-username.exception';

export class Username {
  private static readonly MIN_LENGTH = 3;
  private static readonly MAX_LENGTH = 20;
  private static readonly VALID_PATTERN = /^[a-zA-Z0-9_]+$/;

  private constructor(public readonly value: string) {
    this.validate(value);
  }

  static create(username: string): Username {
    return new Username(username.trim());
  }

  private validate(username: string): void {
    if (!username || username.length === 0) {
      throw new InvalidUsernameException('Username cannot be empty');
    }

    if (username.length < Username.MIN_LENGTH) {
      throw new InvalidUsernameException(
        `Username must be at least ${Username.MIN_LENGTH} characters`,
      );
    }

    if (username.length > Username.MAX_LENGTH) {
      throw new InvalidUsernameException(
        `Username cannot exceed ${Username.MAX_LENGTH} characters`,
      );
    }

    if (!Username.VALID_PATTERN.test(username)) {
      throw new InvalidUsernameException(
        'Username can only contain letters, numbers and underscores',
      );
    }
  }

  equals(other: Username): boolean {
    return this.value === other.value;
  }
}
