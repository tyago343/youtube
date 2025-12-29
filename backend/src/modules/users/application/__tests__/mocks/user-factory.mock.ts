import { UserFactory } from '../../../domain/factories/user.factory';

export interface UserFactoryMocks {
  create: jest.Mock;
  reconstitute: jest.Mock;
  factory: jest.Mocked<UserFactory>;
}

export function createUserFactoryMocks(): UserFactoryMocks {
  const create = jest.fn();
  const reconstitute = jest.fn();

  const factory = {
    create,
    reconstitute,
  } as jest.Mocked<UserFactory>;

  return {
    create,
    reconstitute,
    factory,
  };
}
