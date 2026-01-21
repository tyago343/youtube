import { EventBus } from '../../../../shared/application/ports/event-bus.interface';

export interface EventBusMocks {
  eventBus: EventBus;
  publish: jest.Mock;
}

export function createEventBusMock(): EventBusMocks {
  const publish = jest.fn();

  const eventBus: EventBus = {
    publish,
  };

  return {
    eventBus,
    publish,
  };
}
