import { Injectable } from '@nestjs/common';
import { CreateVideoDto } from './dto/create-video.request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Video } from './entities/video.entity';
import { Repository } from 'typeorm';
import { FileStorageService } from 'src/modules/shared/application/ports/file-storage.interface';

@Injectable()
export class VideosService {
  private readonly VIDEO_FOLDER = 'videos';
  private readonly THUMBNAIL_FOLDER = 'thumbnails';

  constructor(
    @InjectRepository(Video)
    private readonly videoRepository: Repository<Video>,
    private readonly storageService: FileStorageService,
  ) {}

  async create(
    createVideoDto: CreateVideoDto,
    video: Express.Multer.File,
    thumbnail?: Express.Multer.File,
  ) {
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
      thumbnailUrl = thumbnailUrlResult.url;
    }

    const newVideo = this.videoRepository.create({
      ...createVideoDto,
      url: videoUrl.url,
      thumbnailUrl,
    });
    return this.videoRepository.save(newVideo);
  }
}
