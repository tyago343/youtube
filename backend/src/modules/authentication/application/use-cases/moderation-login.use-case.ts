import { ForbiddenException, Injectable } from '@nestjs/common';
import { User } from 'src/modules/users/domain/user.entity';
import { TokenService } from '../ports/token.service.interface';
import { AccessToken } from '../../domain/vo/access-token.vo';
import { RefreshToken } from '../../domain/vo/refresh-token.vo';
import { TokenPayload } from '../../domain/vo/token-payload.vo';

@Injectable()
export class ModerationLoginUseCase {
  constructor(private readonly tokenService: TokenService) {}

  async execute(user: User): Promise<{
    accessToken: AccessToken;
    refreshToken: RefreshToken;
    user: User;
  }> {
    if (!user.isModerator()) {
      throw new ForbiddenException(
        'Access denied. Only MODERATOR or LEGAL users can access the moderation hub.',
      );
    }

    const payload = TokenPayload.create(user.id, user.email, user.role);
    const accessToken = await this.tokenService.generateToken(payload);
    const refreshToken = await this.tokenService.generateRefreshToken(payload);

    return { accessToken, refreshToken, user };
  }
}
