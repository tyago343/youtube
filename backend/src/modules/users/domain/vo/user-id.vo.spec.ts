import { UserId } from './user-id.vo';
import { InvalidUserIdException } from '../exceptions/invalid-user-id.exception';
import { randomUUID } from 'crypto';

describe('UserId', () => {
  describe('create', () => {
    it('should create a valid UserId with UUID', () => {
      const uuid = randomUUID();
      const userId = UserId.create(uuid);
      expect(userId.value).toBe(uuid);
    });

    it('should throw InvalidUserIdException when ID is empty', () => {
      expect(() => UserId.create('')).toThrow(InvalidUserIdException);
      expect(() => UserId.create('   ')).toThrow(InvalidUserIdException);
    });

    it('should throw InvalidUserIdException when format is not UUID', () => {
      expect(() => UserId.create('not-a-uuid')).toThrow(InvalidUserIdException);
      expect(() => UserId.create('12345')).toThrow(InvalidUserIdException);
      expect(() => UserId.create('user-123')).toThrow(InvalidUserIdException);
      expect(() =>
        UserId.create('00000000-0000-0000-0000-00000000000'),
      ).toThrow(InvalidUserIdException);
    });

    it('should accept valid UUIDs in different formats', () => {
      const uuid1 = randomUUID();
      const uuid2 = randomUUID();
      expect(() => UserId.create(uuid1)).not.toThrow();
      expect(() => UserId.create(uuid2)).not.toThrow();
    });
  });

  describe('equals', () => {
    it('should return true when IDs are equal', () => {
      const uuid = randomUUID();
      const userId1 = UserId.create(uuid);
      const userId2 = UserId.create(uuid);
      expect(userId1.equals(userId2)).toBe(true);
    });

    it('should return false when IDs are different', () => {
      const userId1 = UserId.create(randomUUID());
      const userId2 = UserId.create(randomUUID());
      expect(userId1.equals(userId2)).toBe(false);
    });
  });
});
