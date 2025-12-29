import { Injectable, UnauthorizedException } from '@nestjs/common';
import { TokenService } from '../ports/token.service.interface';
import { AccessToken } from '../../domain/vo/access-token.vo';
import { RefreshToken } from '../../domain/vo/refresh-token.vo';

@Injectable()
export class RefreshTokenUseCase {
  constructor(private readonly tokenService: TokenService) {}

  async execute(
    refreshToken: string,
  ): Promise<{ accessToken: AccessToken; refreshToken: RefreshToken }> {
    try {
      const payload = await this.tokenService.verifyRefreshToken(refreshToken);

      const newAccessToken = await this.tokenService.generateToken(payload);
      const newRefreshToken =
        await this.tokenService.generateRefreshToken(payload);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw new UnauthorizedException((error as Error).message);
    }
  }
}
