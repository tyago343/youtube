import { UserId } from './vo/user-id.vo';
import { Email } from './vo/email.vo';
import { Username } from './vo/username.vo';
import { Password } from './vo/password.vo';
import { InvalidAvatarUrlException } from './exceptions/invalid-avatar-url.exception';

export class User {
  public constructor({
    id,
    email,
    username,
    password,
    createdAt,
    avatarUrl,
    updatedAt,
  }: {
    id: UserId;
    email: Email;
    username: Username;
    password: Password;
    createdAt: Date;
    avatarUrl?: string;
    updatedAt?: Date;
  }) {
    this.id = id;
    this.email = email;
    this.username = username;
    this.password = password;
    this.createdAt = createdAt;
    this.avatarUrl = avatarUrl;
    this.updatedAt = updatedAt;
  }

  public readonly id: UserId;
  public email: Email;
  public username: Username;
  public password: Password;
  public readonly createdAt: Date;
  public avatarUrl?: string;
  public updatedAt?: Date;

  static create({
    id,
    email,
    username,
    hashedPassword,
  }: {
    id: string;
    email: string;
    username: string;
    hashedPassword: string;
  }): User {
    return new User({
      id: UserId.create(id),
      email: Email.create(email),
      username: Username.create(username),
      password: Password.fromHashed(hashedPassword),
      createdAt: new Date(),
      avatarUrl: undefined,
    });
  }

  static fromPersistence({
    id,
    email,
    username,
    hashedPassword,
    createdAt,
    avatarUrl,
    updatedAt,
  }: {
    id: string;
    email: string;
    username: string;
    hashedPassword: string;
    createdAt: Date;
    avatarUrl?: string;
    updatedAt?: Date;
  }): User {
    return new User({
      id: UserId.create(id),
      email: Email.create(email),
      username: Username.create(username),
      password: Password.fromHashed(hashedPassword),
      createdAt,
      avatarUrl,
      updatedAt,
    });
  }

  changeAvatar(newAvatarUrl: string): void {
    if (!newAvatarUrl || newAvatarUrl.trim().length === 0) {
      throw new InvalidAvatarUrlException('Avatar URL cannot be empty');
    }

    try {
      new URL(newAvatarUrl);
    } catch {
      throw new InvalidAvatarUrlException(
        `Invalid avatar URL format: ${newAvatarUrl}`,
      );
    }

    this.avatarUrl = newAvatarUrl;
  }

  updateEmail(newEmail: string): void {
    this.email = Email.create(newEmail);
  }

  updateUsername(newUsername: string): void {
    this.username = Username.create(newUsername);
  }

  isOwnerOf(ownerId: string): boolean {
    return this.id.value === ownerId;
  }

  hasAvatar(): boolean {
    return this.avatarUrl !== undefined && this.avatarUrl.length > 0;
  }

  toPrimitives() {
    return {
      id: this.id.value,
      email: this.email.value,
      username: this.username.value,
      password: this.password.value,
      avatarUrl: this.avatarUrl,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
