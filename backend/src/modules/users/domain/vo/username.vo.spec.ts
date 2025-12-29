import { Username } from './username.vo';
import { InvalidUsernameException } from '../exceptions/invalid-username.exception';

describe('Username', () => {
  describe('create', () => {
    it('should create a valid username', () => {
      const username = Username.create('validuser');
      expect(username.value).toBe('validuser');
    });

    it('should normalize the username (trim)', () => {
      const username = Username.create('  validuser  ');
      expect(username.value).toBe('validuser');
    });

    it('should throw InvalidUsernameException when username is empty', () => {
      expect(() => Username.create('')).toThrow(InvalidUsernameException);
    });

    it('should throw InvalidUsernameException when username has less than 3 characters', () => {
      expect(() => Username.create('ab')).toThrow(InvalidUsernameException);
      expect(() => Username.create('a')).toThrow(InvalidUsernameException);
    });

    it('should throw InvalidUsernameException when username has more than 20 characters', () => {
      expect(() => Username.create('a'.repeat(21))).toThrow(
        InvalidUsernameException,
      );
      expect(() => Username.create('a'.repeat(100))).toThrow(
        InvalidUsernameException,
      );
    });

    it('should accept username with exactly 3 characters', () => {
      expect(() => Username.create('abc')).not.toThrow();
      const username = Username.create('abc');
      expect(username.value).toBe('abc');
    });

    it('should accept username with exactly 20 characters', () => {
      const validUsername = 'a'.repeat(20);
      expect(() => Username.create(validUsername)).not.toThrow();
      const username = Username.create(validUsername);
      expect(username.value).toBe(validUsername);
    });

    it('should throw InvalidUsernameException when it contains invalid characters', () => {
      expect(() => Username.create('user-name')).toThrow(
        InvalidUsernameException,
      );
      expect(() => Username.create('user name')).toThrow(
        InvalidUsernameException,
      );
      expect(() => Username.create('user.name')).toThrow(
        InvalidUsernameException,
      );
      expect(() => Username.create('user@name')).toThrow(
        InvalidUsernameException,
      );
      expect(() => Username.create('user#name')).toThrow(
        InvalidUsernameException,
      );
    });

    it('should accept valid usernames with letters, numbers and underscores', () => {
      expect(() => Username.create('user123')).not.toThrow();
      expect(() => Username.create('user_name')).not.toThrow();
      expect(() => Username.create('User123')).not.toThrow();
      expect(() => Username.create('_user_123_')).not.toThrow();
      expect(() => Username.create('123user')).not.toThrow();
    });
  });

  describe('equals', () => {
    it('should return true when usernames are equal', () => {
      const username1 = Username.create('testuser');
      const username2 = Username.create('testuser');
      expect(username1.equals(username2)).toBe(true);
    });

    it('should return false when usernames are different', () => {
      const username1 = Username.create('user1');
      const username2 = Username.create('user2');
      expect(username1.equals(username2)).toBe(false);
    });
  });
});
