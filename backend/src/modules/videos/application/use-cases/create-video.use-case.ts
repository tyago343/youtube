import { FileStorageService } from 'src/modules/shared/application/ports/file-storage.interface';
import { Video } from '../../domain/video.entity';
import { VideosRepository } from '../ports/videos.repository';
import { Injectable } from '@nestjs/common';
import { UserId } from 'src/modules/users/domain/vo/user-id.vo';
import { UserRepository } from 'src/modules/users/application/ports/user.repository';
import { UserNotFoundException } from 'src/modules/users/domain/exceptions/user-not-found.exception';
import { VideoFactory } from '../../domain/factories/video.factory';
@Injectable()
export class CreateVideoUseCase {
  private readonly VIDEO_FOLDER = 'videos';
  private readonly THUMBNAIL_FOLDER = 'thumbnails';

  constructor(
    private readonly videoRepository: VideosRepository,
    private readonly storageService: FileStorageService,
    private readonly userRepository: UserRepository,
    private readonly videoFactory: VideoFactory,
  ) {}
  async execute(
    video: Express.Multer.File,
    data: {
      title: string;
      description: string;
      ownerId: string;
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
    const owner = await this.userRepository.findById(
      UserId.create(data.ownerId),
    );
    if (!owner) {
      throw new UserNotFoundException(data.ownerId);
    }
    const newVideo = this.videoFactory.create({
      ...data,
      url: videoUrl.url,
      thumbnailUrl,
      owner,
      ownerId: owner.id,
      isPublic: data.isPublic,
    });
    return this.videoRepository.create(newVideo);
  }
}
