import { Channel } from './channel.entity';
import { InvalidChannelNameException } from './exceptions/invalid-channel-name.exception';
import { UserId } from 'src/modules/users/domain/vo/user-id.vo';
import { randomUUID } from 'crypto';

describe('Channel', () => {
  const validId = randomUUID();
  const validOwnerId = UserId.create(randomUUID());
  const validName = 'My Channel';
  const validDescription = 'This is my channel description';

  describe('create', () => {
    it('should create a channel correctly', () => {
      const channel = Channel.create({
        id: validId,
        ownerId: validOwnerId,
        name: validName,
        description: validDescription,
      });

      expect(channel.id.value).toBe(validId);
      expect(channel.ownerId.equals(validOwnerId)).toBe(true);
      expect(channel.name).toBe(validName);
      expect(channel.description).toBe(validDescription);
      expect(channel.createdAt).toBeInstanceOf(Date);
      expect(channel.avatarUrl).toBeUndefined();
      expect(channel.bannerUrl).toBeUndefined();
      expect(channel.isMonetizationEnabled).toBe(false);
    });

    it('should create a channel with empty description by default', () => {
      const channel = Channel.create({
        id: validId,
        ownerId: validOwnerId,
        name: validName,
      });

      expect(channel.description).toBe('');
    });

    it('should throw InvalidChannelNameException when name is empty', () => {
      expect(() =>
        Channel.create({
          id: validId,
          ownerId: validOwnerId,
          name: '',
        }),
      ).toThrow(InvalidChannelNameException);
    });

    it('should throw InvalidChannelNameException when name is too short', () => {
      expect(() =>
        Channel.create({
          id: validId,
          ownerId: validOwnerId,
          name: 'ab',
        }),
      ).toThrow(InvalidChannelNameException);
    });

    it('should throw InvalidChannelNameException when name is too long', () => {
      const longName = 'a'.repeat(101);
      expect(() =>
        Channel.create({
          id: validId,
          ownerId: validOwnerId,
          name: longName,
        }),
      ).toThrow(InvalidChannelNameException);
    });
  });

  describe('fromPersistence', () => {
    it('should reconstitute a channel from persistence', () => {
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');
      const avatarUrl = 'https://example.com/avatar.jpg';
      const bannerUrl = 'https://example.com/banner.jpg';

      const channel = Channel.fromPersistence({
        id: validId,
        ownerId: validOwnerId,
        name: validName,
        description: validDescription,
        createdAt,
        avatarUrl,
        bannerUrl,
        isMonetizationEnabled: true,
        updatedAt,
      });

      expect(channel.id.value).toBe(validId);
      expect(channel.ownerId.equals(validOwnerId)).toBe(true);
      expect(channel.name).toBe(validName);
      expect(channel.description).toBe(validDescription);
      expect(channel.createdAt).toEqual(createdAt);
      expect(channel.avatarUrl).toBe(avatarUrl);
      expect(channel.bannerUrl).toBe(bannerUrl);
      expect(channel.isMonetizationEnabled).toBe(true);
      expect(channel.updatedAt).toEqual(updatedAt);
    });

    it('should reconstitute a channel without optional fields', () => {
      const createdAt = new Date('2024-01-01');

      const channel = Channel.fromPersistence({
        id: validId,
        ownerId: validOwnerId,
        name: validName,
        description: validDescription,
        createdAt,
        isMonetizationEnabled: false,
      });

      expect(channel.avatarUrl).toBeUndefined();
      expect(channel.bannerUrl).toBeUndefined();
      expect(channel.updatedAt).toBeUndefined();
    });
  });

  describe('updateName', () => {
    it('should update the channel name', () => {
      const channel = Channel.create({
        id: validId,
        ownerId: validOwnerId,
        name: validName,
      });
      const newName = 'New Channel Name';

      channel.updateName(newName);

      expect(channel.name).toBe(newName);
      expect(channel.updatedAt).toBeInstanceOf(Date);
    });

    it('should throw InvalidChannelNameException when new name is invalid', () => {
      const channel = Channel.create({
        id: validId,
        ownerId: validOwnerId,
        name: validName,
      });

      expect(() => channel.updateName('')).toThrow(InvalidChannelNameException);
      expect(() => channel.updateName('ab')).toThrow(
        InvalidChannelNameException,
      );
    });
  });

  describe('updateDescription', () => {
    it('should update the channel description', () => {
      const channel = Channel.create({
        id: validId,
        ownerId: validOwnerId,
        name: validName,
      });
      const newDescription = 'New description';

      channel.updateDescription(newDescription);

      expect(channel.description).toBe(newDescription);
      expect(channel.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('updateAvatar', () => {
    it('should update the avatar URL', () => {
      const channel = Channel.create({
        id: validId,
        ownerId: validOwnerId,
        name: validName,
      });
      const avatarUrl = 'https://example.com/avatar.jpg';

      channel.updateAvatar(avatarUrl);

      expect(channel.avatarUrl).toBe(avatarUrl);
      expect(channel.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('updateBanner', () => {
    it('should update the banner URL', () => {
      const channel = Channel.create({
        id: validId,
        ownerId: validOwnerId,
        name: validName,
      });
      const bannerUrl = 'https://example.com/banner.jpg';

      channel.updateBanner(bannerUrl);

      expect(channel.bannerUrl).toBe(bannerUrl);
      expect(channel.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('monetization', () => {
    it('should enable monetization', () => {
      const channel = Channel.create({
        id: validId,
        ownerId: validOwnerId,
        name: validName,
      });

      channel.enableMonetization();

      expect(channel.isMonetizationEnabled).toBe(true);
      expect(channel.updatedAt).toBeInstanceOf(Date);
    });

    it('should disable monetization', () => {
      const channel = Channel.fromPersistence({
        id: validId,
        ownerId: validOwnerId,
        name: validName,
        description: validDescription,
        createdAt: new Date(),
        isMonetizationEnabled: true,
      });

      channel.disableMonetization();

      expect(channel.isMonetizationEnabled).toBe(false);
      expect(channel.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('isOwnedBy', () => {
    it('should return true when user owns the channel', () => {
      const channel = Channel.create({
        id: validId,
        ownerId: validOwnerId,
        name: validName,
      });

      expect(channel.isOwnedBy(validOwnerId)).toBe(true);
    });

    it('should return false when user does not own the channel', () => {
      const channel = Channel.create({
        id: validId,
        ownerId: validOwnerId,
        name: validName,
      });
      const otherUserId = UserId.create(randomUUID());

      expect(channel.isOwnedBy(otherUserId)).toBe(false);
    });
  });

  describe('hasAvatar', () => {
    it('should return false when there is no avatar', () => {
      const channel = Channel.create({
        id: validId,
        ownerId: validOwnerId,
        name: validName,
      });

      expect(channel.hasAvatar()).toBe(false);
    });

    it('should return true when there is an avatar', () => {
      const channel = Channel.create({
        id: validId,
        ownerId: validOwnerId,
        name: validName,
      });
      channel.updateAvatar('https://example.com/avatar.jpg');

      expect(channel.hasAvatar()).toBe(true);
    });
  });

  describe('hasBanner', () => {
    it('should return false when there is no banner', () => {
      const channel = Channel.create({
        id: validId,
        ownerId: validOwnerId,
        name: validName,
      });

      expect(channel.hasBanner()).toBe(false);
    });

    it('should return true when there is a banner', () => {
      const channel = Channel.create({
        id: validId,
        ownerId: validOwnerId,
        name: validName,
      });
      channel.updateBanner('https://example.com/banner.jpg');

      expect(channel.hasBanner()).toBe(true);
    });
  });

  describe('toPrimitives', () => {
    it('should return an object with all primitive properties', () => {
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');
      const avatarUrl = 'https://example.com/avatar.jpg';
      const bannerUrl = 'https://example.com/banner.jpg';

      const channel = Channel.fromPersistence({
        id: validId,
        ownerId: validOwnerId,
        name: validName,
        description: validDescription,
        createdAt,
        avatarUrl,
        bannerUrl,
        isMonetizationEnabled: true,
        updatedAt,
      });

      const primitives = channel.toPrimitives();

      expect(primitives).toEqual({
        id: validId,
        ownerId: validOwnerId.value,
        name: validName,
        description: validDescription,
        avatarUrl,
        bannerUrl,
        isMonetizationEnabled: true,
        createdAt,
        updatedAt,
      });
    });

    it('should return primitives without optional fields when they do not exist', () => {
      const channel = Channel.create({
        id: validId,
        ownerId: validOwnerId,
        name: validName,
      });

      const primitives = channel.toPrimitives();

      expect(primitives.avatarUrl).toBeUndefined();
      expect(primitives.bannerUrl).toBeUndefined();
      expect(primitives.updatedAt).toBeUndefined();
    });
  });
});
