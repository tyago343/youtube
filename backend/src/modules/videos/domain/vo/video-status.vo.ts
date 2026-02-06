import { InvalidVideoStatusException } from '../exceptions/invalid-video-status.exception';

export class VideoStatus {
  public static readonly VISIBLE = new VideoStatus('VISIBLE');
  public static readonly HIDDEN = new VideoStatus('HIDDEN');
  public static readonly BANNED = new VideoStatus('BANNED');

  private static readonly VALID_VALUES = [
    'VISIBLE',
    'HIDDEN',
    'BANNED',
  ] as const;

  private constructor(public readonly value: string) {}

  static fromString(value: string): VideoStatus {
    switch (value) {
      case 'VISIBLE':
        return VideoStatus.VISIBLE;
      case 'HIDDEN':
        return VideoStatus.HIDDEN;
      case 'BANNED':
        return VideoStatus.BANNED;
      default:
        throw new InvalidVideoStatusException(
          `Invalid video status: ${value}. Valid values are: ${VideoStatus.VALID_VALUES.join(', ')}`,
        );
    }
  }

  isVisible(): boolean {
    return this.value === 'VISIBLE';
  }

  isHidden(): boolean {
    return this.value === 'HIDDEN';
  }

  isBanned(): boolean {
    return this.value === 'BANNED';
  }

  equals(other: VideoStatus): boolean {
    return this.value === other.value;
  }
}
