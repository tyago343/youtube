import { Injectable } from '@nestjs/common';
import { VideosRepository, VideoWithOwner } from '../ports/videos.repository';

@Injectable()
export class GetAllVideosWithOwnerUseCase {
  constructor(private readonly videosRepository: VideosRepository) {}

  async execute(): Promise<VideoWithOwner[]> {
    return await this.videosRepository.findAllWithOwner();
  }
}
