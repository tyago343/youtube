import { Injectable } from '@nestjs/common';
import { CreateVideoUseCase } from '../use-cases/create-video.use-case';
import { Video } from '../../domain/video.entity';
import { GetAllVideosUseCase } from '../use-cases/get-all-videos.use-case';
import { GetVideoUseCase } from '../use-cases/get-video.use-case';
import { VideoWithChannel } from '../ports/videos.repository';
import { GetVideoWithChannelUseCase } from '../use-cases/get-video-with-owner.use-case';
import { GetAllPublicVideosUseCase } from '../use-cases/get-all-public-videos.use-case';
import { GetPublicVideoUseCase } from '../use-cases/get-public-video.use-case';
import { GetUserVideosUseCase } from '../use-cases/get-user-videos.use-case';

@Injectable()
export class VideosService {
  constructor(
    private readonly createVideoUseCase: CreateVideoUseCase,
    private readonly getAllVideosUseCase: GetAllVideosUseCase,
    private readonly getVideoUseCase: GetVideoUseCase,
    private readonly getVideoWithChannelUseCase: GetVideoWithChannelUseCase,
    private readonly getAllPublicVideosUseCase: GetAllPublicVideosUseCase,
    private readonly getPublicVideoUseCase: GetPublicVideoUseCase,
    private readonly getUserVideosUseCase: GetUserVideosUseCase,
  ) {}

  async create(
    video: Express.Multer.File,
    data: {
      title: string;
      description: string;
      channelId: string;
      visibility?: string;
    },
    thumbnail?: Express.Multer.File,
  ): Promise<Video> {
    return this.createVideoUseCase.execute(video, data, thumbnail);
  }

  async getAll(): Promise<Video[]> {
    return this.getAllVideosUseCase.execute();
  }

  async get(id: string): Promise<Video> {
    return this.getVideoUseCase.execute(id);
  }

  async getAllPublicVideos(): Promise<VideoWithChannel[]> {
    return this.getAllPublicVideosUseCase.execute();
  }

  async getPublicVideo(id: string): Promise<VideoWithChannel> {
    return this.getPublicVideoUseCase.execute(id);
  }

  async getWithChannel(id: string): Promise<VideoWithChannel> {
    return this.getVideoWithChannelUseCase.execute(id);
  }

  async getUserVideos(userId: string): Promise<VideoWithChannel[]> {
    return this.getUserVideosUseCase.execute(userId);
  }
}
