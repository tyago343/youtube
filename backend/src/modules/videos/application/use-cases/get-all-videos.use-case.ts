import { Injectable } from '@nestjs/common';
import { VideosRepository } from '../ports/videos.repository';
import { Video } from '../../domain/video.entity';

@Injectable()
export class GetAllVideosUseCase {
  constructor(private readonly videosRepository: VideosRepository) {}

  async execute(): Promise<Video[]> {
    return await this.videosRepository.findAll();
  }
}
