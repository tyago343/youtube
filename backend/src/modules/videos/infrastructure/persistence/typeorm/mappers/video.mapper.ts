import { Video } from 'src/modules/videos/domain/video.entity';
import { VideoSchema } from '../entities/video.schema';
import { UserId } from 'src/modules/users/domain/vo/user-id.vo';
import { User } from 'src/modules/users/domain/user.entity';
import { UserMapper } from 'src/modules/users/infrastructure/persistence/typeorm/mappers/user.mapper';

export class VideoMapper {
  static toPersistence(video: Video): VideoSchema {
    const schema = new VideoSchema();
    const primitives = video.toPrimitives();

    schema.id = primitives.id;
    schema.title = primitives.title;
    schema.description = primitives.description;
    schema.url = primitives.url;
    schema.thumbnailUrl = primitives.thumbnailUrl;
    schema.ownerId = primitives.ownerId;
    schema.views = primitives.views ?? 0;
    schema.likes = primitives.likes ?? 0;
    schema.dislikes = primitives.dislikes ?? 0;
    schema.isPublic = primitives.isPublic ?? false;
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
      ownerId: UserId.create(schema.ownerId),
      views: schema.views,
      likes: schema.likes,
      dislikes: schema.dislikes,
      isPublic: schema.isPublic,
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
      published: schema.published,
    });
  }

  static toDomainWithOwner(schema: VideoSchema): { video: Video; owner: User } {
    const video = this.toDomain(schema);
    const owner = UserMapper.toDomain(schema.owner);
    return { video, owner };
  }
}
