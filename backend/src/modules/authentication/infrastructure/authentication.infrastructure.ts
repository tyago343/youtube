import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import { JwtAuthGuard } from './guards/jwt-authentication.guard';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { TokenService } from '../application/ports/token.service.interface';
import { JwtTokenService } from './services/jwt-token.service';
import { LocalAuthenticationGuard } from './guards/local-authentication.guard';
import { ValidateUserUseCase } from '../application/use-cases/validate-user.use-case';
import { UsersModule } from 'src/modules/users/users.module';
import { PasswordHashingService } from 'src/modules/shared/application/ports/password-hashing.interface';
import { BcryptPasswordHashingService } from 'src/modules/shared/infrastructure/services/bcrypt-password-hashing.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    UsersModule,
  ],
  providers: [
    {
      provide: TokenService,
      useClass: JwtTokenService,
    },
    {
      provide: PasswordHashingService,
      useClass: BcryptPasswordHashingService,
    },
    ValidateUserUseCase,
    LocalStrategy,
    JwtStrategy,
    LocalAuthenticationGuard,
    JwtAuthGuard,
  ],
  exports: [
    TokenService,
    PasswordHashingService,
    LocalAuthenticationGuard,
    JwtAuthGuard,
  ],
})
export class AuthenticationInfrastructureModule {}
