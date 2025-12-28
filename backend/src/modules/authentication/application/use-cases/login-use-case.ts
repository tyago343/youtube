import { Injectable } from '@nestjs/common';
import { User } from 'src/modules/users/domain/user.entity';
import { TokenService } from '../ports/token.service.interface';
import { AccessToken } from '../../domain/vo/access-token.vo';
import { TokenPayload } from '../../domain/vo/token-payload.vo';

@Injectable()
export class LoginUseCase {
  constructor(private readonly tokenService: TokenService) {}

  async execute(user: User): Promise<{ accessToken: AccessToken; user: User }> {
    const payload = TokenPayload.create(user.id, user.email);
    const accessToken = await this.tokenService.generateToken(payload);
    return { accessToken, user };
  }
}
