import { Injectable } from '@nestjs/common';
import { CreateVideoDto } from './dto/create-video.request.dto';
import { StorageService } from 'src/storage/storage.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Video } from './entities/video.entity';
import { Repository } from 'typeorm';

@Injectable()
export class VideosService {
  private readonly VIDEO_FOLDER = 'videos';
  private readonly THUMBNAIL_FOLDER = 'thumbnails';

  constructor(
    @InjectRepository(Video)
    private readonly videoRepository: Repository<Video>,
    private readonly storageService: StorageService,
  ) {}

  async create(
    createVideoDto: CreateVideoDto,
    video: Express.Multer.File,
    thumbnail?: Express.Multer.File,
  ) {
    const videoUrl = await this.storageService.uploadFile(
      video,
      this.VIDEO_FOLDER,
    );

    let thumbnailUrl: string | undefined;
    if (thumbnail) {
      thumbnailUrl = await this.storageService.uploadFile(
        thumbnail,
        this.THUMBNAIL_FOLDER,
      );
    }

    const newVideo = this.videoRepository.create({
      ...createVideoDto,
      url: videoUrl,
      thumbnailUrl,
    });
    return this.videoRepository.save(newVideo);
  }

  findAll() {
    return `This action returns all videos`;
  }

  findOne(id: string) {
    return `This action returns a #${id} video`;
  }
}
