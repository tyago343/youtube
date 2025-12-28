import { InvalidEmailException } from '../exceptions/invalid-email.exception';

export class Email {
  private constructor(public readonly value: string) {
    this.validate(value);
  }

  static create(email: string): Email {
    const trimmedEmail = email.trim().toLowerCase();
    return new Email(trimmedEmail);
  }

  private validate(email: string): void {
    if (!email || email.trim().length === 0) {
      throw new InvalidEmailException('Email cannot be empty');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new InvalidEmailException(`Invalid email format: ${email}`);
    }
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }
}
