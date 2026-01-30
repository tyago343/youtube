import { Email } from 'src/modules/users/domain/vo/email.vo';
import { UserId } from 'src/modules/users/domain/vo/user-id.vo';
import { UserRole } from 'src/modules/users/domain/vo/user-role.vo';

const DEFAULT_ROLE = 'USER';

export class TokenPayload {
  constructor(
    public readonly userId: string,
    public readonly email: string,
    public readonly role: string = DEFAULT_ROLE,
  ) {
    if (!userId || !email) {
      throw new Error('User ID and email are required');
    }
  }

  static create(
    userId: UserId,
    email: Email,
    role?: UserRole | string,
  ): TokenPayload {
    const roleValue =
      role instanceof UserRole ? role.value : (role ?? DEFAULT_ROLE);
    return new TokenPayload(userId.value, email.value, roleValue);
  }

  static fromDecoded(decoded: {
    sub: string;
    email: string;
    role?: string;
  }): TokenPayload {
    return new TokenPayload(
      decoded.sub,
      decoded.email,
      decoded.role ?? DEFAULT_ROLE,
    );
  }

  isModerator(): boolean {
    return this.role === 'MODERATOR' || this.role === 'LEGAL';
  }

  isLegal(): boolean {
    return this.role === 'LEGAL';
  }
}
