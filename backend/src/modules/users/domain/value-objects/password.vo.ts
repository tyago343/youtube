import { InvalidPasswordException } from '../exceptions/invalid-password.exception';

export class Password {
  private constructor(
    public readonly value: string,
    private readonly isHashed: boolean = false,
  ) {
    if (!isHashed) {
      this.validate(value);
    }
  }

  static create(plainPassword: string): Password {
    return new Password(plainPassword, false);
  }

  static fromHashed(hashedPassword: string): Password {
    return new Password(hashedPassword, true);
  }

  private validate(password: string): void {
    if (!password || password.length === 0) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      throw new InvalidPasswordException('Password cannot be empty');
    }

    if (password.length < 8) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      throw new InvalidPasswordException(
        'Password must be at least 8 characters',
      );
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      throw new InvalidPasswordException(
        'Password must contain at least one uppercase, lowercase and number',
      );
    }
  }
}
