import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSchema } from './persistence/typeorm/entities/user.schema';
import { OrmUserRepository } from './persistence/typeorm/repositories/orm-user.repository';
import { UserRepository } from '../application/ports/user.repository';
import { PasswordHashingService } from 'src/modules/shared/application/ports/password-hashing.interface';
import { BcryptPasswordHashingService } from 'src/modules/shared/infrastructure/services/bcrypt-password-hashing.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserSchema])],
  providers: [
    {
      provide: UserRepository,
      useClass: OrmUserRepository,
    },
    {
      provide: PasswordHashingService,
      useClass: BcryptPasswordHashingService,
    },
  ],
  exports: [UserRepository, PasswordHashingService],
})
export class UsersInfrastructureModule {}
