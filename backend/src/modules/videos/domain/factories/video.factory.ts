import { Video } from '../video.entity';
import { ChannelId } from 'src/modules/channels/domain/vo/channel-id.vo';
import { randomUUID } from 'crypto';
import { VideoVisibility } from '../vo/video-visibility.vo';

export class VideoFactory {
  create({
    title,
    description,
    url,
    thumbnailUrl,
    channelId,
    visibility,
  }: {
    title: string;
    description: string;
    url: string;
    thumbnailUrl?: string;
    channelId: ChannelId;
    visibility?: VideoVisibility;
  }): Video {
    return Video.create({
      id: randomUUID(),
      title,
      description,
      url,
      thumbnailUrl,
      createdAt: new Date(),
      channelId,
      visibility,
    });
  }

  reconstitute({
    id,
    title,
    description,
    url,
    thumbnailUrl,
    channelId,
    visibility,
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
    visibility: string;
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
      visibility,
      published,
      views,
      updatedAt,
      likes,
      dislikes,
    });
  }
}
