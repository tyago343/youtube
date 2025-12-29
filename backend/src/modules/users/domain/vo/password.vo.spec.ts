import { Password } from './password.vo';
import { InvalidPasswordException } from '../exceptions/invalid-password.exception';

describe('Password', () => {
  describe('create', () => {
    it('should create a valid password', () => {
      const password = Password.create('ValidPass123');
      expect(password.value).toBe('ValidPass123');
    });

    it('should throw InvalidPasswordException when password is empty', () => {
      expect(() => Password.create('')).toThrow(InvalidPasswordException);
    });

    it('should throw InvalidPasswordException when password has less than 8 characters', () => {
      expect(() => Password.create('Short1')).toThrow(InvalidPasswordException);
      expect(() => Password.create('Abc123')).toThrow(InvalidPasswordException);
    });

    it('should throw InvalidPasswordException when uppercase is missing', () => {
      expect(() => Password.create('validpass123')).toThrow(
        InvalidPasswordException,
      );
    });

    it('should throw InvalidPasswordException when lowercase is missing', () => {
      expect(() => Password.create('VALIDPASS123')).toThrow(
        InvalidPasswordException,
      );
    });

    it('should throw InvalidPasswordException when number is missing', () => {
      expect(() => Password.create('ValidPassword')).toThrow(
        InvalidPasswordException,
      );
    });

    it('should accept valid passwords with different combinations', () => {
      expect(() => Password.create('ValidPass123')).not.toThrow();
      expect(() => Password.create('Another1Pass')).not.toThrow();
      expect(() => Password.create('MyP@ssw0rd')).not.toThrow();
      expect(() => Password.create('12345678Ab')).not.toThrow();
    });
  });

  describe('fromHashed', () => {
    it('should create a password from a hash without validating format', () => {
      const hashedPassword = '$2b$10$hashedpasswordstringhere';
      const password = Password.fromHashed(hashedPassword);
      expect(password.value).toBe(hashedPassword);
    });

    it('should accept any string as hash without validation', () => {
      const invalidHash = 'short';
      expect(() => Password.fromHashed(invalidHash)).not.toThrow();
      const password = Password.fromHashed(invalidHash);
      expect(password.value).toBe(invalidHash);
    });
  });
});
