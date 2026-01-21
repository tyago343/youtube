export const EventCatalog = {
  User: {
    Created: 'user.created',
  },
} as const;

type EventCatalogType = typeof EventCatalog;
type EventCategory = keyof EventCatalogType;
type EventName<T extends EventCategory> =
  EventCatalogType[T][keyof EventCatalogType[T]];

export type DomainEventName = EventName<'User'>;
