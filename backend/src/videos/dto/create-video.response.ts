import { ApiProperty } from '@nestjs/swagger';
import { Video } from '../entities/video.entity';

export class VideoResponseDto {
  @ApiProperty({
    description: 'The video information',
    type: Video,
  })
  video: Video;
}
