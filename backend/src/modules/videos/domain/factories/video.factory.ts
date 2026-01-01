import { Video } from '../video.entity';
import { UserId } from 'src/modules/users/domain/vo/user-id.vo';
import { randomUUID } from 'crypto';

export class VideoFactory {
  create({
    title,
    description,
    url,
    thumbnailUrl,
    ownerId,
    isPublic,
  }: {
    title: string;
    description: string;
    url: string;
    thumbnailUrl?: string;
    ownerId: UserId;
    isPublic?: boolean;
  }): Video {
    return Video.create({
      id: randomUUID(),
      title,
      description,
      url,
      thumbnailUrl,
      createdAt: new Date(),
      ownerId,
      isPublic,
    });
  }

  reconstitute({
    id,
    title,
    description,
    url,
    thumbnailUrl,
    ownerId,
    isPublic,
    published,
    views,
    likes,
    dislikes,
    createdAt,
    updatedAt,
  }: {
    id: string;
    title: string;
    description: string;
    url: string;
    thumbnailUrl: string;
    ownerId: UserId;
    isPublic: boolean;
    published?: Date;
    views: number;
    likes: number;
    dislikes: number;
    createdAt: Date;
    updatedAt?: Date;
  }): Video {
    return Video.fromPersistence({
      id,
      title,
      description,
      url,
      thumbnailUrl,
      createdAt,
      ownerId,
      isPublic,
      published,
      views,
      updatedAt,
      likes,
      dislikes,
    });
  }
}
