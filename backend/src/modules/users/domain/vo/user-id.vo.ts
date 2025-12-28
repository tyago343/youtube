import { validate as uuidValidate } from 'uuid';
import { InvalidUserIdException } from '../exceptions/invalid-user-id.exception';

export class UserId {
  private constructor(public readonly value: string) {
    this.validate(value);
  }

  static create(id: string): UserId {
    return new UserId(id);
  }

  private validate(id: string): void {
    if (!id || id.trim().length === 0) {
      throw new InvalidUserIdException('User ID cannot be empty');
    }

    if (!uuidValidate(id)) {
      throw new InvalidUserIdException(`Invalid user ID format: ${id}`);
    }
  }

  equals(other: UserId): boolean {
    return this.value === other.value;
  }
}
