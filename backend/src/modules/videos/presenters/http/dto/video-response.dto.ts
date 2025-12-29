import { Video } from 'src/modules/videos/domain/video.entity';

export class VideoResponseDto {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnailUrl: string;
  createdAt: Date;
  likes: number;
  dislikes: number;
  views: number;
  isPublic: boolean;
  updatedAt?: Date;
  published?: Date;
  static fromDomain(video: Video): VideoResponseDto {
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
    return dto;
  }
}
