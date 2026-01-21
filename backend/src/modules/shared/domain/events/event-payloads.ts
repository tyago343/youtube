import { EventCatalog } from './event-catalog';

export interface EventPayloads {
  [EventCatalog.User.Created]: {
    email: string;
    username: string;
  };
}
