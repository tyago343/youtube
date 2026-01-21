import { Module } from '@nestjs/common';
import { NotificationApplicationModule } from './application/notification.application';
import { NotificationInfrastructureModule } from './infrastructure/notification.infrastructure';

@Module({
  imports: [
    NotificationApplicationModule.withInfrastructure(
      NotificationInfrastructureModule,
    ),
  ],
})
export class NotificationModule {}
