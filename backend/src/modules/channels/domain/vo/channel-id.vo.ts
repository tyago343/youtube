import { validate as uuidValidate } from 'uuid';
import { InvalidChannelIdException } from '../exceptions/invalid-channel-id.exception';

export class ChannelId {
  private constructor(public readonly value: string) {
    this.validate(value);
  }

  static create(id: string): ChannelId {
    return new ChannelId(id);
  }

  private validate(id: string): void {
    if (!id || id.trim().length === 0) {
      throw new InvalidChannelIdException('Channel ID cannot be empty');
    }

    if (!uuidValidate(id)) {
      throw new InvalidChannelIdException(`Invalid channel ID format: ${id}`);
    }
  }

  equals(other: ChannelId): boolean {
    return this.value === other.value;
  }
}
