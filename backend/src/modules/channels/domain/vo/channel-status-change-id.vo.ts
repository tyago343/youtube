import { validate as uuidValidate } from 'uuid';

export class ChannelStatusChangeId {
  private constructor(public readonly value: string) {
    this.validate(value);
  }

  static create(id: string): ChannelStatusChangeId {
    return new ChannelStatusChangeId(id);
  }

  private validate(id: string): void {
    if (!id || id.trim().length === 0) {
      throw new Error('ChannelStatusChangeId cannot be empty');
    }

    if (!uuidValidate(id)) {
      throw new Error(`Invalid ChannelStatusChangeId format: ${id}`);
    }
  }

  equals(other: ChannelStatusChangeId): boolean {
    return this.value === other.value;
  }
}
