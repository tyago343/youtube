import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersApplicationModule } from '../../application/users.module';
import { UsersInfrastructureModule } from '../../infrastructure/users-infrastructure.module';

@Module({
  imports: [
    UsersApplicationModule.withInfrastructure(UsersInfrastructureModule),
  ],
  controllers: [UsersController],
})
export class UsersPresentersModule {}
