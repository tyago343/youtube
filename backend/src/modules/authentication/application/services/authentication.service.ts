import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignUpUseCase } from '../use-cases/sign-up.use-case';
import { LoginUseCase } from '../use-cases/login-use-case';
import { RefreshTokenUseCase } from '../use-cases/refresh-token.use-case';
import { ValidateUserUseCase } from '../use-cases/validate-user.use-case';
import { User } from 'src/modules/users/domain/user.entity';
import { UserAlreadyExistsException } from 'src/modules/users/domain/exceptions/user-already-exists.exceptions';
import { UserNotFoundException } from 'src/modules/users/domain/exceptions/user-not-found.exception';
import { AccessToken } from '../../domain/vo/access-token.vo';
import { RefreshToken } from '../../domain/vo/refresh-token.vo';
import { GetUserUseCase } from 'src/modules/users/application/use-cases/get-user.use-case';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly signUpUseCase: SignUpUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly validateUserUseCase: ValidateUserUseCase,
    private readonly getUserUseCase: GetUserUseCase,
  ) {}

  async signUp(
    email: string,
    username: string,
    password: string,
  ): Promise<{
    accessToken: AccessToken;
    refreshToken: RefreshToken;
    user: User;
  }> {
    try {
      return await this.signUpUseCase.execute(email, username, password);
    } catch (error) {
      if (error instanceof UserAlreadyExistsException) {
        throw new ConflictException(error.message);
      }
      throw error;
    }
  }

  async login(
    email: string,
    password: string,
  ): Promise<{
    accessToken: AccessToken;
    refreshToken: RefreshToken;
    user: User;
  }> {
    const user = await this.validateUser(email, password);
    return await this.loginUseCase.execute(user);
  }

  async refreshToken(
    refreshToken: string,
  ): Promise<{ accessToken: AccessToken; refreshToken: RefreshToken }> {
    return await this.refreshTokenUseCase.execute(refreshToken);
  }

  async validateUser(email: string, password: string): Promise<User> {
    return await this.validateUserUseCase.execute(email, password);
  }

  async getUser(identifier: string): Promise<User> {
    try {
      return await this.getUserUseCase.execute(identifier);
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new UnauthorizedException('User not found');
      }
      throw error;
    }
  }
}
