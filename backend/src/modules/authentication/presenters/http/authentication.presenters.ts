import { Module } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationApplicationModule } from '../../application/authentication.application';
import { AuthenticationInfrastructureModule } from '../../infrastructure/authentication.infrastructure';
import { AuthenticationService } from '../../application/services/authentication.service';

@Module({
  imports: [
    AuthenticationApplicationModule.withInfrastructure(
      AuthenticationInfrastructureModule,
    ),
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService],
})
export class AuthenticationPresentersModule {}
