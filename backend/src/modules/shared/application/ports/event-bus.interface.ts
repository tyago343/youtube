import { DomainEvent } from '../../domain/events';

export abstract class EventBus {
  abstract publish<T extends DomainEvent>(event: T): void;
}
