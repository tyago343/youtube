import { UserId } from 'src/modules/users/domain/vo/user-id.vo';
import { ChannelId } from './vo/channel-id.vo';
import { InvalidChannelNameException } from './exceptions/invalid-channel-name.exception';
import { ChannelStatus } from './vo/channel-status.vo';

const MIN_CHANNEL_NAME_LENGTH = 3;
const MAX_CHANNEL_NAME_LENGTH = 100;
const MAX_DESCRIPTION_LENGTH = 5000;

export class Channel {
  public constructor({
    id,
    ownerId,
    name,
    description,
    createdAt,
    status,
    avatarUrl,
    bannerUrl,
    isMonetizationEnabled = false,
    updatedAt,
  }: {
    id: ChannelId;
    ownerId: UserId;
    name: string;
    description: string;
    createdAt: Date;
    status: ChannelStatus;
    avatarUrl?: string;
    bannerUrl?: string;
    isMonetizationEnabled?: boolean;
    updatedAt?: Date;
  }) {
    this.id = id;
    this.ownerId = ownerId;
    this.name = name;
    this.description = description;
    this.createdAt = createdAt;
    this.status = status;
    this.avatarUrl = avatarUrl;
    this.bannerUrl = bannerUrl;
    this.isMonetizationEnabled = isMonetizationEnabled;
    this.updatedAt = updatedAt;
  }

  public readonly id: ChannelId;
  public readonly ownerId: UserId;
  public name: string;
  public description: string;
  public readonly createdAt: Date;
  public status: ChannelStatus;
  public avatarUrl?: string;
  public bannerUrl?: string;
  public isMonetizationEnabled: boolean;
  public updatedAt?: Date;

  static create({
    id,
    ownerId,
    name,
    description = '',
    avatarUrl,
    bannerUrl,
    isMonetizationEnabled,
  }: {
    id: string;
    ownerId: UserId;
    name: string;
    description?: string;
    avatarUrl?: string;
    bannerUrl?: string;
    isMonetizationEnabled?: boolean;
  }): Channel {
    Channel.validateName(name);
    Channel.validateDescription(description);

    return new Channel({
      id: ChannelId.create(id),
      ownerId,
      name,
      description,
      createdAt: new Date(),
      status: ChannelStatus.ACTIVE,
      avatarUrl,
      bannerUrl,
      isMonetizationEnabled,
    });
  }

  static fromPersistence({
    id,
    ownerId,
    name,
    description,
    createdAt,
    status,
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
    status: string;
    avatarUrl?: string;
    bannerUrl?: string;
    isMonetizationEnabled: boolean;
    updatedAt?: Date;
  }): Channel {
    return new Channel({
      id: ChannelId.create(id),
      ownerId,
      name,
      description,
      createdAt,
      status: ChannelStatus.fromString(status),
      avatarUrl,
      bannerUrl,
      isMonetizationEnabled,
      updatedAt,
    });
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

  suspend(): void {
    this.status = ChannelStatus.SUSPENDED;
    this.markAsUpdated();
  }

  sanction(): void {
    this.status = ChannelStatus.SANCTIONED;
    this.markAsUpdated();
  }

  terminate(): void {
    this.status = ChannelStatus.TERMINATED;
    this.markAsUpdated();
  }

  deactivate(): void {
    this.status = ChannelStatus.INACTIVE;
    this.markAsUpdated();
  }

  activate(): void {
    this.status = ChannelStatus.ACTIVE;
    this.markAsUpdated();
  }

  markForReview(): void {
    this.status = ChannelStatus.PENDING_REVIEW;
    this.markAsUpdated();
  }

  isActive(): boolean {
    return this.status.equals(ChannelStatus.ACTIVE);
  }

  isSuspended(): boolean {
    return this.status.equals(ChannelStatus.SUSPENDED);
  }

  isSanctioned(): boolean {
    return this.status.equals(ChannelStatus.SANCTIONED);
  }

  isTerminated(): boolean {
    return this.status.equals(ChannelStatus.TERMINATED);
  }

  isInactive(): boolean {
    return this.status.equals(ChannelStatus.INACTIVE);
  }

  isPendingReview(): boolean {
    return this.status.equals(ChannelStatus.PENDING_REVIEW);
  }

  isPubliclyVisible(): boolean {
    return this.status.isPubliclyVisible();
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
      status: this.status.value,
      avatarUrl: this.avatarUrl,
      bannerUrl: this.bannerUrl,
      isMonetizationEnabled: this.isMonetizationEnabled,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
