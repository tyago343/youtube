import { ApiProperty } from '@nestjs/swagger';
import { Video } from 'src/modules/videos/domain/video.entity';
import { OwnerSummaryDto } from 'src/modules/users/presenters/http/dto/owner-summary.dto';
import { User } from 'src/modules/users/domain/user.entity';

export class VideoResponseDto {
  @ApiProperty({
    description: 'The id of the video',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'The title of the video',
    example: 'My first video',
  })
  title: string;

  @ApiProperty({
    description: 'The description of the video',
    example: 'This is a description of my first video',
  })
  description: string;

  @ApiProperty({
    description: 'The URL of the video',
    example: 'https://example.com/video.mp4',
  })
  url: string;

  @ApiProperty({
    description: 'The URL of the thumbnail',
    example: 'https://example.com/thumbnail.png',
  })
  thumbnailUrl: string;

  @ApiProperty({
    description: 'The created at date of the video',
    example: '2021-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The views of the video',
    example: 100,
  })
  views: number;

  @ApiProperty({
    description: 'The likes of the video',
    example: 100,
  })
  likes: number;

  @ApiProperty({
    description: 'The dislikes of the video',
    example: 100,
  })
  dislikes: number;

  @ApiProperty({
    description: 'Whether the video is public',
    example: true,
  })
  isPublic: boolean;

  @ApiProperty({
    description: 'The owner id of the video',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  ownerId: string;

  @ApiProperty({
    description: 'The owner of the video',
    type: OwnerSummaryDto,
  })
  owner: OwnerSummaryDto;

  @ApiProperty({
    description: 'The updated at date of the video',
    example: '2021-01-01T00:00:00.000Z',
    required: false,
    nullable: true,
  })
  updatedAt?: Date;

  @ApiProperty({
    description: 'The published date of the video',
    example: '2021-01-01T00:00:00.000Z',
    required: false,
    nullable: true,
  })
  published?: Date;

  static fromDomain(video: Video, owner: User): VideoResponseDto {
    const dto = new VideoResponseDto();
    dto.id = video.id.value;
    dto.title = video.title;
    dto.description = video.description;
    dto.url = video.url;
    dto.thumbnailUrl = video.thumbnailUrl;
    dto.createdAt = video.createdAt;
    dto.updatedAt = video.updatedAt;
    dto.views = video.views;
    dto.likes = video.likes;
    dto.dislikes = video.dislikes;
    dto.isPublic = video.isPublic;
    dto.published = video.published;
    dto.ownerId = video.ownerId.value;
    dto.owner = OwnerSummaryDto.fromDomain(owner);
    return dto;
  }
}
