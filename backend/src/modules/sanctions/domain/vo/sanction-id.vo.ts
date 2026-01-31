import { validate as uuidValidate } from 'uuid';
import { InvalidSanctionIdException } from '../exceptions/invalid-sanction-id.exception';

export class SanctionId {
  private constructor(public readonly value: string) {
    this.validate(value);
  }

  static create(id: string): SanctionId {
    return new SanctionId(id);
  }

  private validate(id: string): void {
    if (!id || id.trim().length === 0) {
      throw new InvalidSanctionIdException('Sanction ID cannot be empty');
    }

    if (!uuidValidate(id)) {
      throw new InvalidSanctionIdException(`Invalid sanction ID format: ${id}`);
    }
  }

  equals(other: SanctionId): boolean {
    return this.value === other.value;
  }
}
