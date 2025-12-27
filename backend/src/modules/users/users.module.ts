import { Module } from '@nestjs/common';
import { UsersPresentersModule } from './presenters/http/users.module';

@Module({
  imports: [UsersPresentersModule],
})
export class UsersModule {}
