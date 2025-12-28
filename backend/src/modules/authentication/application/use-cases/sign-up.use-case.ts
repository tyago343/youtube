import { Injectable } from '@nestjs/common';
import { User } from 'src/modules/users/domain/user.entity';
import { UsersService } from 'src/modules/users/application/services/users.service';
import { AccessToken } from '../../domain/vo/access-token.vo';
import { TokenService } from '../ports/token.service.interface';
import { TokenPayload } from '../../domain/vo/token-payload.vo';

@Injectable()
export class SignUpUseCase {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
  ) {}

  async execute(
    email: string,
    username: string,
    password: string,
  ): Promise<{ accessToken: AccessToken; user: User }> {
    const user = await this.usersService.create(email, username, password);
    const payload = TokenPayload.create(user.id, user.email);
    const accessToken = await this.tokenService.generateToken(payload);
    return { accessToken, user };
  }
}
