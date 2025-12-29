import { InvalidVideoIdException } from '../exceptions/invalid-video-id.exception';
import { validate as uuidValidate } from 'uuid';

export class VideoId {
  private constructor(public readonly value: string) {
    this.validate(value);
  }
  static create(value: string): VideoId {
    return new VideoId(value);
  }
  private validate(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new InvalidVideoIdException('Video ID cannot be empty');
    }
    if (!uuidValidate(value)) {
      throw new InvalidVideoIdException('Invalid video ID format');
    }
  }
  equals(other: VideoId): boolean {
    return this.value === other.value;
  }
}
