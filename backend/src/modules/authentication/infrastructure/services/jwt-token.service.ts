import { Injectable, UnauthorizedException } from '@nestjs/common';
import { TokenService } from '../../application/ports/token.service.interface';
import { AccessToken } from '../../domain/vo/access-token.vo';
import { TokenPayload } from '../../domain/vo/token-payload.vo';
import { JwtService } from '@nestjs/jwt';
import { TokenExpiredException } from '../../domain/exceptions/token-expired.exception';
import { UserId } from 'src/modules/users/domain/vo/user-id.vo';
import { Email } from 'src/modules/users/domain/vo/email.vo';

@Injectable()
export class JwtTokenService implements TokenService {
  constructor(private readonly jwtService: JwtService) {}

  async generateToken(payload: TokenPayload): Promise<AccessToken> {
    const token = await this.jwtService.signAsync({
      sub: payload.userId,
      email: payload.email,
    });
    return AccessToken.create(token);
  }

  async verifyToken(token: string): Promise<TokenPayload> {
    try {
      const decoded = await this.jwtService.verifyAsync<{
        sub: string;
        email: string;
      }>(token);

      return TokenPayload.create(
        UserId.create(decoded.sub),
        Email.create(decoded.email),
      );
    } catch (error) {
      if (error instanceof TokenExpiredException) {
        throw new UnauthorizedException(error.message);
      }
      throw error;
    }
  }
}
