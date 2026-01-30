import { Module } from '@nestjs/common';
import { AuthenticationController } from './http/authentication.controller';
import { ModerationAuthController } from './http/moderation-auth.controller';
import { AuthenticationApplicationModule } from '../application/authentication.application';
import { AuthenticationInfrastructureModule } from '../infrastructure/authentication.infrastructure';
import { AuthenticationService } from '../application/services/authentication.service';

@Module({
  imports: [
    AuthenticationApplicationModule.withInfrastructure(
      AuthenticationInfrastructureModule,
    ),
  ],
  controllers: [AuthenticationController, ModerationAuthController],
  providers: [AuthenticationService],
})
export class AuthenticationPresentersModule {}
