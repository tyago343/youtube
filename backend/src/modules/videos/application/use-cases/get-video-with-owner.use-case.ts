import { Injectable } from '@nestjs/common';
import { VideosRepository, VideoWithChannel } from '../ports/videos.repository';
import { VideoNotFoundException } from '../../domain/exceptions/video-not-found.exception';

@Injectable()
export class GetVideoWithChannelUseCase {
  constructor(private readonly videosRepository: VideosRepository) {}

  async execute(id: string): Promise<VideoWithChannel> {
    const result = await this.videosRepository.findByIdWithChannel(id);
    if (!result) {
      throw new VideoNotFoundException();
    }
    return result;
  }
}
