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
    schema.role = primitives.role;
    schema.avatarUrl = primitives.avatarUrl;
    schema.createdAt = primitives.createdAt || new Date();
    return schema;
  }

  static toDomain(schema: UserSchema): User {
    return User.fromPersistence({
      id: schema.id,
      email: schema.email,
      username: schema.username,
      hashedPassword: schema.password,
      role: schema.role,
      createdAt: schema.createdAt,
      avatarUrl: schema.avatarUrl,
      updatedAt: schema.updatedAt,
    });
  }
}
