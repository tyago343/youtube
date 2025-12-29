import { randomUUID } from 'crypto';
import { User } from '../user.entity';
import { Video } from 'src/modules/videos/domain/video.entity';

export class UserFactory {
  create(email: string, username: string, hashedPassword: string): User {
    const userId = randomUUID();
    return User.create(userId, email, username, hashedPassword);
  }

  reconstitute({
    id,
    email,
    username,
    hashedPassword,
    createdAt,
    avatarUrl,
    videos,
    updatedAt,
  }: {
    id: string;
    email: string;
    username: string;
    hashedPassword: string;
    createdAt: Date;
    avatarUrl?: string;
    videos?: Video[];
    updatedAt?: Date;
  }): User {
    return User.fromPersistence({
      id,
      email,
      username,
      hashedPassword,
      createdAt,
      avatarUrl,
      videos,
      updatedAt,
    });
  }
}
