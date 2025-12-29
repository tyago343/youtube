import { VideoMapper } from 'src/modules/videos/infrastructure/persistence/typeorm/mappers/video.mapper';
import { User } from '../../../../domain/user.entity';
import { UserSchema } from '../entities/user.schema';

export class UserMapper {
  static toPersistence(user: User): UserSchema {
    const schema = new UserSchema();
    const primitives = user.toPrimitives();

    schema.id = primitives.id;
    schema.email = primitives.email;
    schema.username = primitives.username;
    schema.password = primitives.password;
    schema.avatarUrl = primitives.avatarUrl;
    schema.createdAt = primitives.createdAt || new Date();
    schema.videos =
      primitives.videos?.map((video) => VideoMapper.toPersistence(video)) || [];
    return schema;
  }

  static toDomain(schema: UserSchema): User {
    return User.fromPersistence({
      id: schema.id,
      email: schema.email,
      username: schema.username,
      hashedPassword: schema.password,
      createdAt: schema.createdAt,
      avatarUrl: schema.avatarUrl,
      videos: schema.videos?.map((video) => VideoMapper.toDomain(video)),
    });
  }
}
