import { FileStorageService } from 'src/modules/shared/application/ports/file-storage.interface';
import { Video } from '../../domain/video.entity';
import { VideosRepository } from '../ports/videos.repository';
import { Injectable } from '@nestjs/common';
import { ChannelId } from 'src/modules/channels/domain/vo/channel-id.vo';
import { ChannelRepository } from 'src/modules/channels/application/ports/channel.repository';
import { ChannelNotFoundException } from 'src/modules/channels/domain/exceptions/channel-not-found.exception';
import { VideoFactory } from '../../domain/factories/video.factory';
@Injectable()
export class CreateVideoUseCase {
  private readonly VIDEO_FOLDER = 'videos';
  private readonly THUMBNAIL_FOLDER = 'thumbnails';

  constructor(
    private readonly videoRepository: VideosRepository,
    private readonly storageService: FileStorageService,
    private readonly channelRepository: ChannelRepository,
    private readonly videoFactory: VideoFactory,
  ) {}
  async execute(
    video: Express.Multer.File,
    data: {
      title: string;
      description: string;
      channelId: string;
      isPublic?: boolean;
    },
    thumbnail?: Express.Multer.File,
  ): Promise<Video> {
    const videoUrl = await this.storageService.uploadFile(video, {
      folder: this.VIDEO_FOLDER,
    });
    let thumbnailUrl: string | undefined;
    if (thumbnail) {
      const thumbnailUrlResult = await this.storageService.uploadFile(
        thumbnail,
        {
          folder: this.THUMBNAIL_FOLDER,
        },
      );
      thumbnailUrl = thumbnailUrlResult?.url;
    }
    const channelId = ChannelId.create(data.channelId);
    const channel = await this.channelRepository.findById(channelId);
    if (!channel) {
      throw new ChannelNotFoundException(data.channelId);
    }
    const newVideo = this.videoFactory.create({
      title: data.title,
      description: data.description,
      url: videoUrl.url,
      thumbnailUrl,
      channelId,
      isPublic: data.isPublic,
    });
    return this.videoRepository.create(newVideo);
  }
}
