import { Injectable } from '@nestjs/common';
import { VideosRepository, VideoWithChannel } from '../ports/videos.repository';

@Injectable()
export class GetUserVideosUseCase {
  constructor(private readonly videosRepository: VideosRepository) {}

  async execute(userId: string): Promise<VideoWithChannel[]> {
    return await this.videosRepository.findAllByOwnerIdWithChannel(userId);
  }
}
