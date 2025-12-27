import { Module } from '@nestjs/common';
import { UsersPresentersModule } from './presenters/http/users.module';
import { UsersApplicationModule } from './application/users.module';
import { UsersInfrastructureModule } from './infrastructure/users-infrastructure.module';

@Module({
  imports: [
    UsersApplicationModule.withInfrastructure(UsersInfrastructureModule),
    UsersPresentersModule,
  ],
  exports: [UsersApplicationModule],
})
export class UsersModule {}
