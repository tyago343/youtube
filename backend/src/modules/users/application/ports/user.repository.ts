import { User } from '../../domain/user.entity';
import { UserId } from '../../domain/value-objects/user-id.vo';
import { Email } from '../../domain/value-objects/email.vo';
import { Username } from '../../domain/value-objects/username.vo';

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
