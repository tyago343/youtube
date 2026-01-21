import { DomainEvent } from './domain-event.interface';
import { EventPayloads } from './event-payloads';

export interface TypedDomainEvent<
  K extends keyof EventPayloads,
> extends DomainEvent<K> {
  readonly payload: EventPayloads[K];
}

export function createEvent<K extends keyof EventPayloads>(
  eventName: K,
  payload: EventPayloads[K],
): TypedDomainEvent<K> {
  return {
    eventName,
    payload,
    occurredOn: new Date(),
  };
}
