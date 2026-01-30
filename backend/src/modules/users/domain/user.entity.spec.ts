import { User } from './user.entity';
import { InvalidAvatarUrlException } from './exceptions/invalid-avatar-url.exception';
import { randomUUID } from 'crypto';

describe('User', () => {
  const validId = randomUUID();
  const validEmail = 'test@example.com';
  const validUsername = 'testuser';
  const validHashedPassword = '$2b$10$hashedpasswordstringhere';

  describe('create', () => {
    it('should create a user correctly', () => {
      const user = User.create({
        id: validId,
        email: validEmail,
        username: validUsername,
        hashedPassword: validHashedPassword,
      });

      expect(user.id.value).toBe(validId);
      expect(user.email.value).toBe(validEmail);
      expect(user.username.value).toBe(validUsername);
      expect(user.password.value).toBe(validHashedPassword);
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.avatarUrl).toBeUndefined();
    });
  });

  describe('fromPersistence', () => {
    it('should reconstitute a user from persistence', () => {
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');
      const avatarUrl = 'https://example.com/avatar.jpg';

      const user = User.fromPersistence({
        id: validId,
        email: validEmail,
        username: validUsername,
        hashedPassword: validHashedPassword,
        createdAt,
        avatarUrl,
        updatedAt,
      });

      expect(user.id.value).toBe(validId);
      expect(user.email.value).toBe(validEmail);
      expect(user.username.value).toBe(validUsername);
      expect(user.password.value).toBe(validHashedPassword);
      expect(user.createdAt).toEqual(createdAt);
      expect(user.avatarUrl).toBe(avatarUrl);
      expect(user.updatedAt).toEqual(updatedAt);
    });

    it('should reconstitute a user without optional fields', () => {
      const createdAt = new Date('2024-01-01');

      const user = User.fromPersistence({
        id: validId,
        email: validEmail,
        username: validUsername,
        hashedPassword: validHashedPassword,
        createdAt,
      });

      expect(user.avatarUrl).toBeUndefined();
      expect(user.updatedAt).toBeUndefined();
    });
  });

  describe('changeAvatar', () => {
    it('should update avatar with a valid URL', () => {
      const user = User.create({
        id: validId,
        email: validEmail,
        username: validUsername,
        hashedPassword: validHashedPassword,
      });
      const avatarUrl = 'https://example.com/avatar.jpg';

      user.changeAvatar(avatarUrl);

      expect(user.avatarUrl).toBe(avatarUrl);
    });

    it('should throw InvalidAvatarUrlException when URL is empty', () => {
      const user = User.create({
        id: validId,
        email: validEmail,
        username: validUsername,
        hashedPassword: validHashedPassword,
      });

      expect(() => user.changeAvatar('')).toThrow(InvalidAvatarUrlException);
      expect(() => user.changeAvatar('   ')).toThrow(InvalidAvatarUrlException);
    });

    it('should throw InvalidAvatarUrlException when URL is invalid', () => {
      const user = User.create({
        id: validId,
        email: validEmail,
        username: validUsername,
        hashedPassword: validHashedPassword,
      });

      expect(() => user.changeAvatar('not-a-url')).toThrow(
        InvalidAvatarUrlException,
      );
      expect(() => user.changeAvatar('invalid')).toThrow(
        InvalidAvatarUrlException,
      );
    });

    it('should accept different valid URL formats', () => {
      const user = User.create({
        id: validId,
        email: validEmail,
        username: validUsername,
        hashedPassword: validHashedPassword,
      });

      expect(() =>
        user.changeAvatar('https://example.com/avatar.jpg'),
      ).not.toThrow();
      expect(() =>
        user.changeAvatar('http://example.com/avatar.png'),
      ).not.toThrow();
      expect(() =>
        user.changeAvatar('https://cdn.example.com/users/123/avatar'),
      ).not.toThrow();
    });
  });

  describe('updateEmail', () => {
    it('should update the email', () => {
      const user = User.create({
        id: validId,
        email: validEmail,
        username: validUsername,
        hashedPassword: validHashedPassword,
      });
      const newEmail = 'newemail@example.com';

      user.updateEmail(newEmail);

      expect(user.email.value).toBe(newEmail);
    });
  });

  describe('updateUsername', () => {
    it('should update the username', () => {
      const user = User.create({
        id: validId,
        email: validEmail,
        username: validUsername,
        hashedPassword: validHashedPassword,
      });
      const newUsername = 'newusername';

      user.updateUsername(newUsername);

      expect(user.username.value).toBe(newUsername);
    });
  });

  describe('isOwnerOf', () => {
    it('should return true when ID matches', () => {
      const user = User.create({
        id: validId,
        email: validEmail,
        username: validUsername,
        hashedPassword: validHashedPassword,
      });

      expect(user.isOwnerOf(validId)).toBe(true);
    });

    it('should return false when ID does not match', () => {
      const user = User.create({
        id: validId,
        email: validEmail,
        username: validUsername,
        hashedPassword: validHashedPassword,
      });
      const otherId = randomUUID();

      expect(user.isOwnerOf(otherId)).toBe(false);
    });
  });

  describe('hasAvatar', () => {
    it('should return false when there is no avatar', () => {
      const user = User.create({
        id: validId,
        email: validEmail,
        username: validUsername,
        hashedPassword: validHashedPassword,
      });

      expect(user.hasAvatar()).toBe(false);
    });

    it('should return true when there is an avatar', () => {
      const user = User.create({
        id: validId,
        email: validEmail,
        username: validUsername,
        hashedPassword: validHashedPassword,
      });
      user.changeAvatar('https://example.com/avatar.jpg');

      expect(user.hasAvatar()).toBe(true);
    });

    it('should return false when avatar is empty', () => {
      const user = User.fromPersistence({
        id: validId,
        email: validEmail,
        username: validUsername,
        hashedPassword: validHashedPassword,
        createdAt: new Date(),
        avatarUrl: '',
      });

      expect(user.hasAvatar()).toBe(false);
    });
  });

  describe('toPrimitives', () => {
    it('should return an object with all primitive properties', () => {
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');
      const avatarUrl = 'https://example.com/avatar.jpg';

      const user = User.fromPersistence({
        id: validId,
        email: validEmail,
        username: validUsername,
        hashedPassword: validHashedPassword,
        createdAt,
        avatarUrl,
        updatedAt,
      });

      const primitives = user.toPrimitives();

      expect(primitives).toEqual({
        id: validId,
        email: validEmail,
        username: validUsername,
        password: validHashedPassword,
        role: 'USER',
        avatarUrl,
        createdAt,
        updatedAt,
      });
    });

    it('should return primitives without optional fields when they do not exist', () => {
      const user = User.create({
        id: validId,
        email: validEmail,
        username: validUsername,
        hashedPassword: validHashedPassword,
      });

      const primitives = user.toPrimitives();

      expect(primitives.avatarUrl).toBeUndefined();
      expect(primitives.updatedAt).toBeUndefined();
    });
  });
});
