import { Reflector } from '@nestjs/core';

export function createReflectorMock(): jest.Mocked<Reflector> {
  return {
    getAllAndOverride: jest.fn(),
    getAll: jest.fn(),
    get: jest.fn(),
  } as any;
}
