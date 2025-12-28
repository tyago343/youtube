import { Email } from 'src/modules/users/domain/vo/email.vo';
import { UserId } from 'src/modules/users/domain/vo/user-id.vo';

export class TokenPayload {
  constructor(
    public readonly userId: string,
    public readonly email: string,
  ) {
    if (!userId || !email) {
      throw new Error('User ID and email are required');
    }
  }
  static create(userId: UserId, email: Email): TokenPayload {
    return new TokenPayload(userId.value, email.value);
  }
}
