import { Injectable } from '@nestjs/common';
import { VideosRepository, VideoWithChannel } from '../ports/videos.repository';
import { VideoVisibility } from '../../domain/vo/video-visibility.vo';

@Injectable()
export class GetAllPublicVideosUseCase {
  constructor(private readonly videosRepository: VideosRepository) {}

  async execute(): Promise<VideoWithChannel[]> {
    return await this.videosRepository.findAllByVisibilityWithChannel(
      VideoVisibility.PUBLIC,
    );
  }
}
