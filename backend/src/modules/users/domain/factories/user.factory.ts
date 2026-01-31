import { randomUUID } from 'crypto';
import { User } from '../user.entity';
import { UserRole } from '../vo/user-role.vo';

export class UserFactory {
  create({
    email,
    username,
    hashedPassword,
    role,
  }: {
    email: string;
    username: string;
    hashedPassword: string;
    role?: UserRole;
  }): User {
    return User.create({
      id: randomUUID(),
      email,
      username,
      hashedPassword,
      role,
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
