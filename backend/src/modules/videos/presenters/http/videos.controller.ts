import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { VideosService } from '../../application/services/videos.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { CreateVideoDto } from './dto/create-video.dto';
import { VideoResponseDto } from './dto/video-response.dto';
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

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a new video',
    description: 'Creates a new video. Requires valid JWT token.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: CreateVideoDto,
  })
  @ApiOkResponse({
    description: 'Video created successfully',
    type: VideoResponseDto,
  })
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'video', maxCount: 1 },
      { name: 'thumbnail', maxCount: 1 },
    ]),
  )
  async create(
    @Body() createVideoDto: CreateVideoDto,
    @UploadedFiles()
    files: {
      video?: Express.Multer.File[];
      thumbnail?: Express.Multer.File[];
    },
  ) {
    if (!files.video || !files.video[0]) {
      throw new BadRequestException('Video file is required');
    }

    const video = files.video[0];
    const thumbnail = files.thumbnail?.[0];

    if (!this.ALLOWED_VIDEO_TYPES.includes(video.mimetype)) {
      throw new BadRequestException(
        `Invalid video type. Allowed types: ${this.ALLOWED_VIDEO_TYPES.join(', ')}`,
      );
    }

    // Validar tamaño de video
    if (video.size > this.MAX_VIDEO_SIZE) {
      throw new BadRequestException(
        `Video file size exceeds maximum allowed size of ${this.MAX_VIDEO_SIZE / 1024 / 1024}MB`,
      );
    }

    // Validar thumbnail si está presente
    if (thumbnail) {
      if (!this.ALLOWED_IMAGE_TYPES.includes(thumbnail.mimetype)) {
        throw new BadRequestException(
          `Invalid thumbnail type. Allowed types: ${this.ALLOWED_IMAGE_TYPES.join(', ')}`,
        );
      }
      if (thumbnail.size > this.MAX_THUMBNAIL_SIZE) {
        throw new BadRequestException(
          `Thumbnail file size exceeds maximum allowed size of ${this.MAX_THUMBNAIL_SIZE / 1024 / 1024}MB`,
        );
      }
    }

    const newVideo = await this.videosService.create(
      video,
      createVideoDto,
      thumbnail,
    );
    return VideoResponseDto.fromDomain(newVideo);
  }
}
