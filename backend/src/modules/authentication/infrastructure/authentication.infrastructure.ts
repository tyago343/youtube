import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import { JwtAuthGuard } from './guards/jwt-authentication.guard';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { PasswordVerifier } from '../application/ports/password-verifier.interface';
import { TokenService } from '../application/ports/token.service.interface';
import { BcryptPasswordVerifierService } from './services/bcrypt-password-verifier.service';
import { JwtTokenService } from './services/jwt-token.service';
import { LocalAuthenticationGuard } from './guards/local-authentication.guard';
import { ValidateUserUseCase } from '../application/use-cases/validate-user.use-case';
import { UsersModule } from 'src/modules/users/users.module';

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
      provide: PasswordVerifier,
      useClass: BcryptPasswordVerifierService,
    },
    ValidateUserUseCase,
    LocalStrategy,
    JwtStrategy,
    LocalAuthenticationGuard,
    JwtAuthGuard,
  ],
  exports: [
    TokenService,
    PasswordVerifier,
    LocalAuthenticationGuard,
    JwtAuthGuard,
  ],
})
export class AuthenticationInfrastructureModule {}
