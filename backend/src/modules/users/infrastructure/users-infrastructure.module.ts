import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSchema } from './persistence/typeorm/entities/user.schema';
import { OrmUserRepository } from './persistence/typeorm/repositories/orm-user.repository';
import { BcryptHashingService } from './services/bcrypt-hashing.service';
import { UserRepository } from '../application/ports/user.repository';
import { HashingService } from '../application/ports/hashing.service.interface';

@Module({
  imports: [TypeOrmModule.forFeature([UserSchema])],
  providers: [
    {
      provide: UserRepository,
      useClass: OrmUserRepository,
    },
    {
      provide: HashingService,
      useClass: BcryptHashingService,
    },
  ],
  exports: [UserRepository, HashingService],
})
export class UsersInfrastructureModule {}
