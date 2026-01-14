import { ChannelId } from './channel-id.vo';
import { InvalidChannelIdException } from '../exceptions/invalid-channel-id.exception';
import { randomUUID } from 'crypto';

describe('ChannelId', () => {
  describe('create', () => {
    it('should create a valid ChannelId with UUID', () => {
      const uuid = randomUUID();
      const channelId = ChannelId.create(uuid);
      expect(channelId.value).toBe(uuid);
    });

    it('should throw InvalidChannelIdException when ID is empty', () => {
      expect(() => ChannelId.create('')).toThrow(InvalidChannelIdException);
      expect(() => ChannelId.create('   ')).toThrow(InvalidChannelIdException);
    });

    it('should throw InvalidChannelIdException when format is not UUID', () => {
      expect(() => ChannelId.create('not-a-uuid')).toThrow(
        InvalidChannelIdException,
      );
      expect(() => ChannelId.create('12345')).toThrow(
        InvalidChannelIdException,
      );
      expect(() => ChannelId.create('channel-123')).toThrow(
        InvalidChannelIdException,
      );
      expect(() =>
        ChannelId.create('00000000-0000-0000-0000-00000000000'),
      ).toThrow(InvalidChannelIdException);
    });

    it('should accept valid UUIDs in different formats', () => {
      const uuid1 = randomUUID();
      const uuid2 = randomUUID();
      expect(() => ChannelId.create(uuid1)).not.toThrow();
      expect(() => ChannelId.create(uuid2)).not.toThrow();
    });
  });

  describe('equals', () => {
    it('should return true when IDs are equal', () => {
      const uuid = randomUUID();
      const channelId1 = ChannelId.create(uuid);
      const channelId2 = ChannelId.create(uuid);
      expect(channelId1.equals(channelId2)).toBe(true);
    });

    it('should return false when IDs are different', () => {
      const channelId1 = ChannelId.create(randomUUID());
      const channelId2 = ChannelId.create(randomUUID());
      expect(channelId1.equals(channelId2)).toBe(false);
    });
  });
});
