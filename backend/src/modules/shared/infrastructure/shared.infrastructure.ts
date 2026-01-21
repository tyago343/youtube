import { Module } from '@nestjs/common';
import { BcryptPasswordHashingService } from './services/bcrypt-password-hashing.service';
import { NestEventBus } from './services/nest-event-bus.service';
import { PasswordHashingService } from '../application/ports/password-hashing.interface';
import { EventBus } from '../application/ports/event-bus.interface';

@Module({
  providers: [
    {
      provide: PasswordHashingService,
      useClass: BcryptPasswordHashingService,
    },
    {
      provide: EventBus,
      useClass: NestEventBus,
    },
  ],
  exports: [PasswordHashingService, EventBus],
})
export class SharedInfrastructureModule {}
