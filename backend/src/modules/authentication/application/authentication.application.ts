import { DynamicModule, Module, Type } from '@nestjs/common';
import { SignUpUseCase } from './use-cases/sign-up.use-case';
import { LoginUseCase } from './use-cases/login-use-case';
import { ValidateUserUseCase } from './use-cases/validate-user.use-case';
import { AuthenticationService } from './services/authentication.service';
import { UsersModule } from 'src/modules/users/users.module';

const useCases = [SignUpUseCase, LoginUseCase, ValidateUserUseCase];

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
