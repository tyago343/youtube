import { Module } from '@nestjs/common';
import { UsersPresentersModule } from './presenters/http/users.presenters';
import { UsersApplicationModule } from './application/users.application';
import { UsersInfrastructureModule } from './infrastructure/users.infrastructure';

@Module({
  imports: [
    UsersApplicationModule.withInfrastructure(UsersInfrastructureModule),
    UsersPresentersModule,
  ],
  exports: [UsersApplicationModule],
})
export class UsersModule {}
