import { InvalidVideoVisibilityException } from '../exceptions/invalid-video-visibility.exception';

export class VideoVisibility {
  public static readonly PUBLIC = new VideoVisibility('PUBLIC');
  public static readonly PRIVATE = new VideoVisibility('PRIVATE');
  public static readonly MEMBERS = new VideoVisibility('MEMBERS');

  private constructor(public readonly value: string) {}

  static fromString(value: string): VideoVisibility {
    switch (value) {
      case 'PUBLIC':
        return VideoVisibility.PUBLIC;
      case 'PRIVATE':
        return VideoVisibility.PRIVATE;
      case 'MEMBERS':
        return VideoVisibility.MEMBERS;
      default:
        throw new InvalidVideoVisibilityException(
          `Invalid video visibility: ${value}`,
        );
    }
  }
}
