import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { VideosService } from './videos.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('videos')
export class VideosController {
  private readonly MAX_VIDEO_SIZE = 1024 * 1024 * 500; // 500MB
  private readonly MAX_THUMBNAIL_SIZE = 1024 * 1024 * 5; // 5MB
  private readonly ALLOWED_VIDEO_TYPES = [
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'video/mpeg',
    'video/avi',
  ];
  private readonly ALLOWED_IMAGE_TYPES = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp',
  ];

  constructor(private readonly videosService: VideosService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'video', maxCount: 1 },
      { name: 'thumbnail', maxCount: 1 },
    ]),
  )
  create(
    @Body() createVideoDto: CreateVideoDto,
    @UploadedFiles()
    files: {
      video: Express.Multer.File[];
      thumbnail?: Express.Multer.File[];
    },
  ) {
    const video = files.video[0];
    const thumbnail = files.thumbnail?.[0];

    if (video.size > this.MAX_VIDEO_SIZE) {
      throw new BadRequestException(
        `File exceeds the maximum size of ${this.MAX_VIDEO_SIZE / (1024 * 1024)}MB`,
      );
    }

    if (!this.ALLOWED_VIDEO_TYPES.includes(video.mimetype)) {
      throw new BadRequestException(
        `File type not allowed. Allowed types: ${this.ALLOWED_VIDEO_TYPES.join(', ')}`,
      );
    }

    if (thumbnail) {
      if (thumbnail.size > this.MAX_THUMBNAIL_SIZE) {
        throw new BadRequestException(
          `File exceeds the maximum size of ${this.MAX_THUMBNAIL_SIZE / (1024 * 1024)}MB`,
        );
      }

      if (!this.ALLOWED_IMAGE_TYPES.includes(thumbnail.mimetype)) {
        throw new BadRequestException(
          `File type not allowed. Allowed types: ${this.ALLOWED_IMAGE_TYPES.join(', ')}`,
        );
      }
    }

    return this.videosService.create(createVideoDto, video, thumbnail);
  }

  @Get()
  findAll() {
    return this.videosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.videosService.findOne(id);
  }
}
