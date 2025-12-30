import { VideoNotFoundException } from '../../domain/exceptions/video-not-found.exception';
import { Video } from '../../domain/video.entity';
import { VideosRepository } from '../ports/videos.repository';
import { Injectable } from '@nestjs/common';
@Injectable()
export class GetVideoUseCase {
  constructor(private readonly videosRepository: VideosRepository) {}

  async execute(id: string): Promise<Video> {
    const video = await this.videosRepository.findById(id);
    if (!video) {
      throw new VideoNotFoundException(`Video not found: ${id}`);
    }
    return video;
  }
}
