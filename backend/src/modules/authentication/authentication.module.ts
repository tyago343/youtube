import { Module } from '@nestjs/common';
import { AuthenticationPresentersModule } from './presenters/authentication.presenters';
import { AuthenticationApplicationModule } from './application/authentication.application';
import { AuthenticationInfrastructureModule } from './infrastructure/authentication.infrastructure';

@Module({
  imports: [
    AuthenticationApplicationModule.withInfrastructure(
      AuthenticationInfrastructureModule,
    ),
    AuthenticationPresentersModule,
  ],
  exports: [AuthenticationApplicationModule],
})
export class AuthenticationModule {}
