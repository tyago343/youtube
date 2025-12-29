import { Video } from '../video.entity';
import { UserId } from 'src/modules/users/domain/vo/user-id.vo';
import { randomUUID } from 'crypto';
import { User } from 'src/modules/users/domain/user.entity';
export class VideoFactory {
  create({
    title,
    description,
    url,
    thumbnailUrl,
    ownerId,
    owner,
    isPublic,
  }: {
    title: string;
    description: string;
    url: string;
    thumbnailUrl?: string;
    ownerId: UserId;
    owner: User;
    isPublic?: boolean;
    published?: Date;
  }): Video {
    return Video.create({
      id: randomUUID(),
      title,
      description,
      url,
      thumbnailUrl,
      createdAt: new Date(),
      ownerId,
      owner,
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
    owner,
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
    owner: User;
    isPublic: boolean;
    published: Date;
    views: number;
    likes: number;
    dislikes: number;
    createdAt: Date;
    updatedAt: Date;
  }): Video {
    return Video.fromPersistence({
      id,
      title,
      description,
      url,
      thumbnailUrl,
      createdAt,
      ownerId,
      owner,
      isPublic,
      published,
      views,
      updatedAt,
      likes,
      dislikes,
    });
  }
}
