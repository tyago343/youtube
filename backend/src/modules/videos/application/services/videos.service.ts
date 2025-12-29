import { Injectable } from '@nestjs/common';
import { CreateVideoUseCase } from '../use-cases/create-video.use-case';
import { Video } from '../../domain/video.entity';

@Injectable()
export class VideosService {
  constructor(private readonly createVideoUseCase: CreateVideoUseCase) {}

  async create(
    video: Express.Multer.File,
    data: {
      title: string;
      description: string;
      ownerId: string;
      isPublic?: boolean;
    },
    thumbnail?: Express.Multer.File,
  ): Promise<Video> {
    return await this.createVideoUseCase.execute(video, data, thumbnail);
  }
}
