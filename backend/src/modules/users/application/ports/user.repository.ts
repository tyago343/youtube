import { User } from '../../domain/user.entity';
import { UserId } from '../../domain/vo/user-id.vo';
import { Email } from '../../domain/vo/email.vo';
import { Username } from '../../domain/vo/username.vo';

export abstract class UserRepository {
  abstract save(user: User): Promise<User>;
  abstract findById(id: UserId): Promise<User | null>;
  abstract findByEmail(email: Email): Promise<User | null>;
  abstract findByUsername(username: Username): Promise<User | null>;
  abstract existsByEmail(email: Email): Promise<boolean>;
  abstract existsByUsername(username: Username): Promise<boolean>;
  abstract findAll(): Promise<User[]>;
  abstract delete(id: UserId): Promise<void>;
}
