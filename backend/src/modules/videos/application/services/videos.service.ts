import { Injectable } from '@nestjs/common';
import { CreateVideoUseCase } from '../use-cases/create-video.use-case';
import { Video } from '../../domain/video.entity';
import { GetAllVideosUseCase } from '../use-cases/get-all-videos.use-case';
import { GetVideoUseCase } from '../use-cases/get-video.use-case';
import { VideoWithOwner } from '../ports/videos.repository';
import { GetAllVideosWithOwnerUseCase } from '../use-cases/get-all-videos-with-owner.use-case';
import { GetVideoWithOwnerUseCase } from '../use-cases/get-video-with-owner.use-case';

@Injectable()
export class VideosService {
  constructor(
    private readonly createVideoUseCase: CreateVideoUseCase,
    private readonly getAllVideosUseCase: GetAllVideosUseCase,
    private readonly getVideoUseCase: GetVideoUseCase,
    private readonly getAllVideosWithOwnerUseCase: GetAllVideosWithOwnerUseCase,
    private readonly getVideoWithOwnerUseCase: GetVideoWithOwnerUseCase,
  ) {}

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
  async getAll(): Promise<Video[]> {
    return await this.getAllVideosUseCase.execute();
  }
  async get(id: string): Promise<Video> {
    return await this.getVideoUseCase.execute(id);
  }
  async getAllWithOwner(): Promise<VideoWithOwner[]> {
    return await this.getAllVideosWithOwnerUseCase.execute();
  }
  async getWithOwner(id: string): Promise<VideoWithOwner> {
    return await this.getVideoWithOwnerUseCase.execute(id);
  }
}
