import { DynamicModule, Module, Type } from '@nestjs/common';
import { SignUpUseCase } from './use-cases/sign-up.use-case';
import { LoginUseCase } from './use-cases/login.use-case';
import { ModerationLoginUseCase } from './use-cases/moderation-login.use-case';
import { ValidateUserUseCase } from './use-cases/validate-user.use-case';
import { AuthenticationService } from './services/authentication.service';
import { UsersModule } from 'src/modules/users/users.module';
import { GetUserUseCase } from 'src/modules/users/application/use-cases/get-user.use-case';
import { RefreshTokenUseCase } from './use-cases/refresh-token.use-case';

const useCases = [
  SignUpUseCase,
  LoginUseCase,
  ModerationLoginUseCase,
  ValidateUserUseCase,
  GetUserUseCase,
  RefreshTokenUseCase,
];

@Module({
  imports: [UsersModule],
  providers: [...useCases, AuthenticationService],
  exports: [...useCases, AuthenticationService],
})
export class AuthenticationApplicationModule {
  static withInfrastructure(
    infrastructureModule: Type | DynamicModule,
  ): DynamicModule {
    return {
      module: AuthenticationApplicationModule,
      imports: [infrastructureModule, UsersModule],
      providers: [...useCases, AuthenticationService],
      exports: [...useCases, AuthenticationService],
    };
  }
}
