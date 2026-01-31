import { UserId } from './vo/user-id.vo';
import { Email } from './vo/email.vo';
import { Username } from './vo/username.vo';
import { Password } from './vo/password.vo';
import { UserRole } from './vo/user-role.vo';
import { UserStatus } from './vo/user-status.vo';
import { InvalidAvatarUrlException } from './exceptions/invalid-avatar-url.exception';

export class User {
  public constructor({
    id,
    email,
    username,
    password,
    role,
    status,
    createdAt,
    avatarUrl,
    updatedAt,
  }: {
    id: UserId;
    email: Email;
    username: Username;
    password: Password;
    role: UserRole;
    status: UserStatus;
    createdAt: Date;
    avatarUrl?: string;
    updatedAt?: Date;
  }) {
    this.id = id;
    this.email = email;
    this.username = username;
    this.password = password;
    this.role = role;
    this.status = status;
    this.createdAt = createdAt;
    this.avatarUrl = avatarUrl;
    this.updatedAt = updatedAt;
  }

  public readonly id: UserId;
  public email: Email;
  public username: Username;
  public password: Password;
  public readonly role: UserRole;
  public status: UserStatus;
  public readonly createdAt: Date;
  public avatarUrl?: string;
  public updatedAt?: Date;

  static create({
    id,
    email,
    username,
    hashedPassword,
    role = UserRole.USER,
    status = UserStatus.ACTIVE,
  }: {
    id: string;
    email: string;
    username: string;
    hashedPassword: string;
    role?: UserRole;
    status?: UserStatus;
  }): User {
    return new User({
      id: UserId.create(id),
      email: Email.create(email),
      username: Username.create(username),
      password: Password.fromHashed(hashedPassword),
      role,
      status,
      createdAt: new Date(),
      avatarUrl: undefined,
    });
  }

  static fromPersistence({
    id,
    email,
    username,
    hashedPassword,
    role,
    status,
    createdAt,
    avatarUrl,
    updatedAt,
  }: {
    id: string;
    email: string;
    username: string;
    hashedPassword: string;
    role?: string;
    status?: string;
    createdAt: Date;
    avatarUrl?: string;
    updatedAt?: Date;
  }): User {
    return new User({
      id: UserId.create(id),
      email: Email.create(email),
      username: Username.create(username),
      password: Password.fromHashed(hashedPassword),
      role: role ? UserRole.fromString(role) : UserRole.USER,
      status: status ? UserStatus.fromString(status) : UserStatus.ACTIVE,
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

  isModerator(): boolean {
    return this.role.isModerator();
  }

  isLegal(): boolean {
    return this.role.isLegal();
  }

  isActive(): boolean {
    return this.status.isActive();
  }

  isSanctioned(): boolean {
    return this.status.isSanctioned();
  }

  isBanned(): boolean {
    return this.status.isBanned();
  }

  canAuthenticate(): boolean {
    return this.status.canAuthenticate();
  }

  sanction(): void {
    this.status = UserStatus.SANCTIONED;
  }

  ban(): void {
    this.status = UserStatus.BANNED;
  }

  activate(): void {
    this.status = UserStatus.ACTIVE;
  }

  toPrimitives() {
    return {
      id: this.id.value,
      email: this.email.value,
      username: this.username.value,
      password: this.password.value,
      role: this.role.value,
      status: this.status.value,
      avatarUrl: this.avatarUrl,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
