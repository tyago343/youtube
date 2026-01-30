import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TokenService } from '../../application/ports/token.service.interface';
import { AccessToken } from '../../domain/vo/access-token.vo';
import { RefreshToken } from '../../domain/vo/refresh-token.vo';
import { TokenPayload } from '../../domain/vo/token-payload.vo';
import { JwtService } from '@nestjs/jwt';
import { TokenExpiredException } from '../../domain/exceptions/token-expired.exception';

@Injectable()
export class JwtTokenService implements TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateToken(payload: TokenPayload): Promise<AccessToken> {
    const accessTokenTtl =
      this.configService.get<number>('jwt.accessTokenTtl') ?? 3600;
    const token = await this.jwtService.signAsync(
      {
        sub: payload.userId,
        email: payload.email,
        role: payload.role,
      },
      {
        expiresIn: `${accessTokenTtl}s`,
      },
    );
    return AccessToken.create(token);
  }

  async generateRefreshToken(payload: TokenPayload): Promise<RefreshToken> {
    const refreshTokenTtl =
      this.configService.get<number>('jwt.refreshTokenTtl') ?? 604800;
    const token = await this.jwtService.signAsync(
      {
        sub: payload.userId,
        email: payload.email,
        role: payload.role,
        type: 'refresh',
      },
      {
        expiresIn: `${refreshTokenTtl}s`,
      },
    );
    return RefreshToken.create(token);
  }

  async verifyToken(token: string): Promise<TokenPayload> {
    try {
      const decoded = await this.jwtService.verifyAsync<{
        sub: string;
        email: string;
        role?: string;
        type?: string;
      }>(token);

      // Ensure it's not a refresh token
      if (decoded.type === 'refresh') {
        throw new UnauthorizedException('Invalid token type');
      }

      return TokenPayload.fromDecoded(decoded);
    } catch (error) {
      if (error instanceof TokenExpiredException) {
        throw new UnauthorizedException(error.message);
      }
      throw error;
    }
  }

  async verifyRefreshToken(token: string): Promise<TokenPayload> {
    try {
      const decoded = await this.jwtService.verifyAsync<{
        sub: string;
        email: string;
        role?: string;
        type?: string;
      }>(token);

      // Ensure it's a refresh token
      if (decoded.type !== 'refresh') {
        throw new UnauthorizedException('Invalid token type');
      }

      return TokenPayload.fromDecoded(decoded);
    } catch (error) {
      if (error instanceof TokenExpiredException) {
        throw new UnauthorizedException('Refresh token expired');
      }
      throw error;
    }
  }
}
