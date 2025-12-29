import { Module } from '@nestjs/common';
import { UsersController } from './http/users.controller';
import { UsersApplicationModule } from '../application/users.application';
import { UsersInfrastructureModule } from '../infrastructure/users.infrastructure';

@Module({
  imports: [
    UsersApplicationModule.withInfrastructure(UsersInfrastructureModule),
  ],
  controllers: [UsersController],
})
export class UsersPresentersModule {}
