import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { User } from '../user.entity';

@Injectable()
export class UserFactory {
  create(email: string, username: string, hashedPassword: string): User {
    const userId = randomUUID();
    return User.create(userId, email, username, hashedPassword);
  }

  reconstitute(
    id: string,
    email: string,
    username: string,
    hashedPassword: string,
    avatarUrl?: string,
    createdAt?: Date,
  ): User {
    return User.fromPersistence(
      id,
      email,
      username,
      hashedPassword,
      avatarUrl,
      createdAt,
    );
  }
}
