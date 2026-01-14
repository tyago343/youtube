import { Video } from '../video.entity';
import { ChannelId } from 'src/modules/channels/domain/vo/channel-id.vo';
import { randomUUID } from 'crypto';

export class VideoFactory {
  create({
    title,
    description,
    url,
    thumbnailUrl,
    channelId,
    isPublic,
  }: {
    title: string;
    description: string;
    url: string;
    thumbnailUrl?: string;
    channelId: ChannelId;
    isPublic?: boolean;
  }): Video {
    return Video.create({
      id: randomUUID(),
      title,
      description,
      url,
      thumbnailUrl,
      createdAt: new Date(),
      channelId,
      isPublic,
    });
  }

  reconstitute({
    id,
    title,
    description,
    url,
    thumbnailUrl,
    channelId,
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
    channelId: ChannelId;
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
      channelId,
      isPublic,
      published,
      views,
      updatedAt,
      likes,
      dislikes,
    });
  }
}
