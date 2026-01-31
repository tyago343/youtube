import { Video } from 'src/modules/videos/domain/video.entity';
import { VideoSchema } from '../entities/video.schema';
import { ChannelId } from 'src/modules/channels/domain/vo/channel-id.vo';
import { Channel } from 'src/modules/channels/domain/channel.entity';
import { ChannelMapper } from 'src/modules/channels/infrastructure/persistence/typeorm/mappers/channel.mapper';
import { VideoVisibility } from 'src/modules/videos/domain/vo/video-visibility.vo';
import { VideoStatus } from 'src/modules/videos/domain/vo/video-status.vo';

export class VideoMapper {
  static toPersistence(video: Video): VideoSchema {
    const schema = new VideoSchema();
    const primitives = video.toPrimitives();

    schema.id = primitives.id;
    schema.title = primitives.title;
    schema.description = primitives.description;
    schema.url = primitives.url;
    schema.thumbnailUrl = primitives.thumbnailUrl;
    schema.channelId = primitives.channelId;
    schema.views = primitives.views ?? 0;
    schema.likes = primitives.likes ?? 0;
    schema.dislikes = primitives.dislikes ?? 0;
    schema.visibility = primitives.visibility ?? VideoVisibility.PRIVATE.value;
    schema.status = primitives.status ?? VideoStatus.VISIBLE.value;
    schema.createdAt = primitives.createdAt ?? new Date();
    schema.published = primitives.published;
    schema.updatedAt = primitives.updatedAt;

    return schema;
  }

  static toDomain(schema: VideoSchema): Video {
    return Video.fromPersistence({
      id: schema.id,
      title: schema.title,
      description: schema.description,
      url: schema.url,
      thumbnailUrl: schema.thumbnailUrl,
      channelId: ChannelId.create(schema.channelId),
      views: schema.views,
      likes: schema.likes,
      dislikes: schema.dislikes,
      visibility: schema.visibility,
      status: schema.status,
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
      published: schema.published,
    });
  }

  static toDomainWithChannel(schema: VideoSchema): {
    video: Video;
    channel: Channel;
  } {
    const video = this.toDomain(schema);
    const channel = ChannelMapper.toDomain(schema.channel);
    return { video, channel };
  }
}
