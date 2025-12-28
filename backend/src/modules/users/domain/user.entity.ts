import { UserId } from './vo/user-id.vo';
import { Email } from './vo/email.vo';
import { Username } from './vo/username.vo';
import { Password } from './vo/password.vo';
import { InvalidAvatarUrlException } from './exceptions/invalid-avatar-url.exception';

export class User {
  private constructor(
    private readonly _id: UserId,
    private _email: Email,
    private _username: Username,
    private readonly _password: Password,
    private _avatarUrl?: string,
    private readonly _createdAt?: Date,
    private readonly _videos?: any[],
  ) {}

  get id(): UserId {
    return this._id;
  }

  get email(): Email {
    return this._email;
  }

  get username(): Username {
    return this._username;
  }

  get password(): Password {
    return this._password;
  }

  get avatarUrl(): string | undefined {
    return this._avatarUrl;
  }

  get createdAt(): Date | undefined {
    return this._createdAt;
  }

  static create(
    id: string,
    email: string,
    username: string,
    hashedPassword: string,
  ): User {
    return new User(
      UserId.create(id),
      Email.create(email),
      Username.create(username),
      Password.fromHashed(hashedPassword),
      undefined,
      new Date(),
      [],
    );
  }

  static fromPersistence(
    id: string,
    email: string,
    username: string,
    hashedPassword: string,
    avatarUrl?: string,
    createdAt?: Date,
  ): User {
    return new User(
      UserId.create(id),
      Email.create(email),
      Username.create(username),
      Password.fromHashed(hashedPassword),
      avatarUrl,
      createdAt,
      [],
    );
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

    this._avatarUrl = newAvatarUrl;
  }

  updateEmail(newEmail: string): void {
    this._email = Email.create(newEmail);
  }

  updateUsername(newUsername: string): void {
    this._username = Username.create(newUsername);
  }

  isOwnerOf(ownerId: string): boolean {
    return this._id.value === ownerId;
  }

  hasAvatar(): boolean {
    return this._avatarUrl !== undefined && this._avatarUrl.length > 0;
  }

  toPrimitives() {
    return {
      id: this._id.value,
      email: this._email.value,
      username: this._username.value,
      password: this._password.value,
      avatarUrl: this._avatarUrl,
      createdAt: this._createdAt,
    };
  }
}
