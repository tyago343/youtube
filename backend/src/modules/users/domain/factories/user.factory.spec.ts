import { UserFactory } from './user.factory';
import { User } from '../user.entity';

describe('UserFactory', () => {
  let factory: UserFactory;

  beforeEach(() => {
    factory = new UserFactory();
  });

  describe('create', () => {
    it('should create a user with a unique UUID', () => {
      const email = 'test@example.com';
      const username = 'testuser';
      const hashedPassword = '$2b$10$hashedpasswordstringhere';

      const user = factory.create(email, username, hashedPassword);

      expect(user).toBeInstanceOf(User);
      expect(user.email.value).toBe(email);
      expect(user.username.value).toBe(username);
      expect(user.password.value).toBe(hashedPassword);
      expect(user.id.value).toBeDefined();
      expect(user.createdAt).toBeInstanceOf(Date);
    });

    it('should generate unique IDs for multiple users', () => {
      const email1 = 'test1@example.com';
      const email2 = 'test2@example.com';
      const username1 = 'testuser1';
      const username2 = 'testuser2';
      const hashedPassword = '$2b$10$hashedpasswordstringhere';

      const user1 = factory.create(email1, username1, hashedPassword);
      const user2 = factory.create(email2, username2, hashedPassword);

      expect(user1.id.value).not.toBe(user2.id.value);
    });
  });

  describe('reconstitute', () => {
    it('should reconstitute a user from persistence data', () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const email = 'test@example.com';
      const username = 'testuser';
      const hashedPassword = '$2b$10$hashedpasswordstringhere';
      const createdAt = new Date('2024-01-01');
      const avatarUrl = 'https://example.com/avatar.jpg';
      const updatedAt = new Date('2024-01-02');

      const user = factory.reconstitute({
        id,
        email,
        username,
        hashedPassword,
        createdAt,
        avatarUrl,
        updatedAt,
      });

      expect(user).toBeInstanceOf(User);
      expect(user.id.value).toBe(id);
      expect(user.email.value).toBe(email);
      expect(user.username.value).toBe(username);
      expect(user.password.value).toBe(hashedPassword);
      expect(user.createdAt).toEqual(createdAt);
      expect(user.avatarUrl).toBe(avatarUrl);
      expect(user.updatedAt).toEqual(updatedAt);
    });

    it('should reconstitute a user without optional fields', () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const email = 'test@example.com';
      const username = 'testuser';
      const hashedPassword = '$2b$10$hashedpasswordstringhere';
      const createdAt = new Date('2024-01-01');

      const user = factory.reconstitute({
        id,
        email,
        username,
        hashedPassword,
        createdAt,
      });

      expect(user.avatarUrl).toBeUndefined();
      expect(user.updatedAt).toBeUndefined();
    });
  });
});
