import { Injectable } from '@nestjs/common';
import { VideosRepository, VideoWithChannel } from '../ports/videos.repository';

@Injectable()
export class GetAllVideosWithChannelUseCase {
  constructor(private readonly videosRepository: VideosRepository) {}

  async execute(): Promise<VideoWithChannel[]> {
    return await this.videosRepository.findAllWithChannel();
  }
}
