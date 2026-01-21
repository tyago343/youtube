import { EventCatalog } from '../event-catalog';
import { EventPayloads } from '../event-payloads';
import { TypedDomainEvent } from '../event-factory';

type UserCreatedEventName = typeof EventCatalog.User.Created;
type UserCreatedPayload = EventPayloads[UserCreatedEventName];

export class UserCreatedEvent implements TypedDomainEvent<UserCreatedEventName> {
  readonly eventName = EventCatalog.User.Created;
  readonly occurredOn: Date;
  readonly payload: UserCreatedPayload;

  constructor(payload: UserCreatedPayload) {
    this.payload = payload;
    this.occurredOn = new Date();
  }
}
