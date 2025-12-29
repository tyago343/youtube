import { Module } from '@nestjs/common';
import { UsersPresentersModule } from './presenters/users.presenters';
import { UsersApplicationModule } from './application/users.application';
import { UsersInfrastructureModule } from './infrastructure/users.infrastructure';

@Module({
  imports: [
    UsersApplicationModule.withInfrastructure(UsersInfrastructureModule),
    UsersInfrastructureModule,
    UsersPresentersModule,
  ],
  exports: [UsersApplicationModule, UsersInfrastructureModule],
})
export class UsersModule {}
