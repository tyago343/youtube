import { DomainEventName } from './event-catalog';

export interface DomainEvent<T extends DomainEventName = DomainEventName> {
  readonly eventName: T;
  readonly occurredOn: Date;
}
