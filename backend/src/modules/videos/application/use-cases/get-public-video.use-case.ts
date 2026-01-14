import { Injectable } from '@nestjs/common';
import { VideosRepository, VideoWithChannel } from '../ports/videos.repository';
import { VideoVisibility } from '../../domain/vo/video-visibility.vo';
import { VideoNotFoundException } from '../../domain/exceptions/video-not-found.exception';

@Injectable()
export class GetPublicVideoUseCase {
  constructor(private readonly videosRepository: VideosRepository) {}

  async execute(id: string): Promise<VideoWithChannel> {
    const result = await this.videosRepository.findByIdAndVisibilityWithChannel(
      id,
      VideoVisibility.PUBLIC,
    );
    if (!result) {
      throw new VideoNotFoundException();
    }
    return result;
  }
}
