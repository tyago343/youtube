import { randomUUID } from 'crypto';
import { User } from '../user.entity';

export class UserFactory {
  create(email: string, username: string, hashedPassword: string): User {
    return User.create({
      id: randomUUID(),
      email,
      username,
      hashedPassword,
    });
  }

  reconstitute({
    id,
    email,
    username,
    hashedPassword,
    role,
    createdAt,
    avatarUrl,
    updatedAt,
  }: {
    id: string;
    email: string;
    username: string;
    hashedPassword: string;
    role?: string;
    createdAt: Date;
    avatarUrl?: string;
    updatedAt?: Date;
  }): User {
    return User.fromPersistence({
      id,
      email,
      username,
      hashedPassword,
      role,
      createdAt,
      avatarUrl,
      updatedAt,
    });
  }
}
