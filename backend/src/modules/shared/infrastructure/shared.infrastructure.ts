import { Module } from '@nestjs/common';
import { BcryptPasswordHashingService } from './services/bcrypt-password-hashing.service';
import { PasswordHashingService } from '../application/ports/password-hashing.interface';

@Module({
  providers: [
    {
      provide: PasswordHashingService,
      useClass: BcryptPasswordHashingService,
    },
  ],
  exports: [PasswordHashingService],
})
export class SharedInfrastructureModule {}
