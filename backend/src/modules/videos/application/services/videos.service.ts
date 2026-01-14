import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateVideoUseCase } from '../use-cases/create-video.use-case';
import { Video } from '../../domain/video.entity';
import { GetAllVideosUseCase } from '../use-cases/get-all-videos.use-case';
import { GetVideoUseCase } from '../use-cases/get-video.use-case';
import { VideoWithChannel } from '../ports/videos.repository';
import { GetAllVideosWithChannelUseCase } from '../use-cases/get-all-videos-with-owner.use-case';
import { GetVideoWithChannelUseCase } from '../use-cases/get-video-with-owner.use-case';
import { VideoNotFoundException } from '../../domain/exceptions/video-not-found.exception';
import { ChannelNotFoundException } from 'src/modules/channels/domain/exceptions/channel-not-found.exception';

@Injectable()
export class VideosService {
  constructor(
    private readonly createVideoUseCase: CreateVideoUseCase,
    private readonly getAllVideosUseCase: GetAllVideosUseCase,
    private readonly getVideoUseCase: GetVideoUseCase,
    private readonly getAllVideosWithChannelUseCase: GetAllVideosWithChannelUseCase,
    private readonly getVideoWithChannelUseCase: GetVideoWithChannelUseCase,
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
    try {
      return await this.createVideoUseCase.execute(video, data, thumbnail);
    } catch (error) {
      if (error instanceof ChannelNotFoundException) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }
  async getAll(): Promise<Video[]> {
    return await this.getAllVideosUseCase.execute();
  }
  async get(id: string): Promise<Video> {
    try {
      return await this.getVideoUseCase.execute(id);
    } catch (error) {
      if (error instanceof VideoNotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
  async getAllWithChannel(): Promise<VideoWithChannel[]> {
    return await this.getAllVideosWithChannelUseCase.execute();
  }
  async getWithChannel(id: string): Promise<VideoWithChannel> {
    try {
      return await this.getVideoWithChannelUseCase.execute(id);
    } catch (error) {
      if (error instanceof VideoNotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
}
