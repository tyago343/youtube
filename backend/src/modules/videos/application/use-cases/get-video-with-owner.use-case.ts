import { Injectable } from '@nestjs/common';
import { VideosRepository, VideoWithOwner } from '../ports/videos.repository';
import { VideoNotFoundException } from '../../domain/exceptions/video-not-found.exception';

@Injectable()
export class GetVideoWithOwnerUseCase {
  constructor(private readonly videosRepository: VideosRepository) {}

  async execute(id: string): Promise<VideoWithOwner> {
    const result = await this.videosRepository.findByIdWithOwner(id);
    if (!result) {
      throw new VideoNotFoundException();
    }
    return result;
  }
}
