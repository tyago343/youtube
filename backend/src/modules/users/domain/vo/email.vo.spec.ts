import { Email } from './email.vo';
import { InvalidEmailException } from '../exceptions/invalid-email.exception';

describe('Email', () => {
  describe('create', () => {
    it('should create a valid email', () => {
      const email = Email.create('test@example.com');
      expect(email.value).toBe('test@example.com');
    });

    it('should normalize the email (trim and lowercase)', () => {
      const email = Email.create('  TEST@EXAMPLE.COM  ');
      expect(email.value).toBe('test@example.com');
    });

    it('should throw InvalidEmailException when email is empty', () => {
      expect(() => Email.create('')).toThrow(InvalidEmailException);
      expect(() => Email.create('   ')).toThrow(InvalidEmailException);
    });

    it('should throw InvalidEmailException when format is invalid', () => {
      expect(() => Email.create('invalid-email')).toThrow(
        InvalidEmailException,
      );
      expect(() => Email.create('invalid@')).toThrow(InvalidEmailException);
      expect(() => Email.create('@example.com')).toThrow(InvalidEmailException);
      expect(() => Email.create('test@')).toThrow(InvalidEmailException);
      expect(() => Email.create('test.example.com')).toThrow(
        InvalidEmailException,
      );
    });

    it('should accept valid emails with different formats', () => {
      expect(() => Email.create('user@domain.com')).not.toThrow();
      expect(() => Email.create('user.name@domain.co.uk')).not.toThrow();
      expect(() => Email.create('user+tag@domain.com')).not.toThrow();
      expect(() => Email.create('user123@domain123.com')).not.toThrow();
    });
  });

  describe('equals', () => {
    it('should return true when emails are equal', () => {
      const email1 = Email.create('test@example.com');
      const email2 = Email.create('TEST@EXAMPLE.COM');
      expect(email1.equals(email2)).toBe(true);
    });

    it('should return false when emails are different', () => {
      const email1 = Email.create('test1@example.com');
      const email2 = Email.create('test2@example.com');
      expect(email1.equals(email2)).toBe(false);
    });
  });
});
