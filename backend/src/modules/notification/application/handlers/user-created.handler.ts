import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EventCatalog } from '../../../shared/domain/events/event-catalog';
import { UserCreatedEvent } from '../../../shared/domain/events';
import { SendWelcomeEmailUseCase } from '../use-cases/send-welcome-email.use-case';

@Injectable()
export class UserCreatedHandler {
  constructor(
    private readonly sendWelcomeEmailUseCase: SendWelcomeEmailUseCase,
  ) {}

  @OnEvent(EventCatalog.User.Created)
  async handle(event: UserCreatedEvent): Promise<void> {
    await this.sendWelcomeEmailUseCase.execute({
      email: event.payload.email,
      username: event.payload.username,
    });
  }
}
