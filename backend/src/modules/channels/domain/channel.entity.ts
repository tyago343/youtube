import { UserId } from 'src/modules/users/domain/vo/user-id.vo';
import { ChannelId } from './vo/channel-id.vo';
import { InvalidChannelNameException } from './exceptions/invalid-channel-name.exception';

const MIN_CHANNEL_NAME_LENGTH = 3;
const MAX_CHANNEL_NAME_LENGTH = 100;
const MAX_DESCRIPTION_LENGTH = 5000;

export class Channel {
  public constructor(
    public readonly id: ChannelId,
    public readonly ownerId: UserId,
    public name: string,
    public description: string,
    public readonly createdAt: Date,
    public avatarUrl?: string,
    public bannerUrl?: string,
    public isMonetizationEnabled: boolean = false,
    public updatedAt?: Date,
  ) {}

  static create({
    id,
    ownerId,
    name,
    description = '',
  }: {
    id: string;
    ownerId: UserId;
    name: string;
    description?: string;
  }): Channel {
    Channel.validateName(name);
    Channel.validateDescription(description);

    return new Channel(
      ChannelId.create(id),
      ownerId,
      name,
      description,
      new Date(),
      undefined,
      undefined,
      false,
      undefined,
    );
  }

  static fromPersistence({
    id,
    ownerId,
    name,
    description,
    createdAt,
    avatarUrl,
    bannerUrl,
    isMonetizationEnabled,
    updatedAt,
  }: {
    id: string;
    ownerId: UserId;
    name: string;
    description: string;
    createdAt: Date;
    avatarUrl?: string;
    bannerUrl?: string;
    isMonetizationEnabled: boolean;
    updatedAt?: Date;
  }): Channel {
    return new Channel(
      ChannelId.create(id),
      ownerId,
      name,
      description,
      createdAt,
      avatarUrl,
      bannerUrl,
      isMonetizationEnabled,
      updatedAt,
    );
  }

  private static validateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new InvalidChannelNameException('Channel name cannot be empty');
    }

    if (name.length < MIN_CHANNEL_NAME_LENGTH) {
      throw new InvalidChannelNameException(
        `Channel name must be at least ${MIN_CHANNEL_NAME_LENGTH} characters`,
      );
    }

    if (name.length > MAX_CHANNEL_NAME_LENGTH) {
      throw new InvalidChannelNameException(
        `Channel name cannot exceed ${MAX_CHANNEL_NAME_LENGTH} characters`,
      );
    }
  }

  private static validateDescription(description: string): void {
    if (description.length > MAX_DESCRIPTION_LENGTH) {
      throw new InvalidChannelNameException(
        `Channel description cannot exceed ${MAX_DESCRIPTION_LENGTH} characters`,
      );
    }
  }

  updateName(newName: string): void {
    Channel.validateName(newName);
    this.name = newName;
    this.markAsUpdated();
  }

  updateDescription(newDescription: string): void {
    Channel.validateDescription(newDescription);
    this.description = newDescription;
    this.markAsUpdated();
  }

  updateAvatar(newAvatarUrl: string): void {
    this.avatarUrl = newAvatarUrl;
    this.markAsUpdated();
  }

  updateBanner(newBannerUrl: string): void {
    this.bannerUrl = newBannerUrl;
    this.markAsUpdated();
  }

  enableMonetization(): void {
    this.isMonetizationEnabled = true;
    this.markAsUpdated();
  }

  disableMonetization(): void {
    this.isMonetizationEnabled = false;
    this.markAsUpdated();
  }

  isOwnedBy(ownerId: UserId): boolean {
    return this.ownerId.equals(ownerId);
  }

  hasAvatar(): boolean {
    return this.avatarUrl !== undefined && this.avatarUrl.length > 0;
  }

  hasBanner(): boolean {
    return this.bannerUrl !== undefined && this.bannerUrl.length > 0;
  }

  private markAsUpdated(): void {
    this.updatedAt = new Date();
  }

  toPrimitives() {
    return {
      id: this.id.value,
      ownerId: this.ownerId.value,
      name: this.name,
      description: this.description,
      avatarUrl: this.avatarUrl,
      bannerUrl: this.bannerUrl,
      isMonetizationEnabled: this.isMonetizationEnabled,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
