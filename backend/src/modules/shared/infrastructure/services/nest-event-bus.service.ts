import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventBus } from '../../application/ports/event-bus.interface';
import { DomainEvent } from '../../domain/events';

@Injectable()
export class NestEventBus extends EventBus {
  constructor(private readonly eventEmitter: EventEmitter2) {
    super();
  }

  publish<T extends DomainEvent>(event: T): void {
    this.eventEmitter.emit(event.eventName, event);
  }
}
