import { UserRepository } from '../../ports/user.repository';

export interface UserRepositoryMocks {
  findById: jest.Mock;
  findByEmail: jest.Mock;
  findByUsername: jest.Mock;
  existsByEmail: jest.Mock;
  existsByUsername: jest.Mock;
  save: jest.Mock;
  findAll: jest.Mock;
  delete: jest.Mock;
  repository: jest.Mocked<UserRepository>;
}

export function createUserRepositoryMocks(): UserRepositoryMocks {
  const findById = jest.fn();
  const findByEmail = jest.fn();
  const findByUsername = jest.fn();
  const existsByEmail = jest.fn();
  const existsByUsername = jest.fn();
  const save = jest.fn();
  const findAll = jest.fn();
  const deleteMock = jest.fn();

  const repository = {
    findById,
    findByEmail,
    findByUsername,
    existsByEmail,
    existsByUsername,
    save,
    findAll,
    delete: deleteMock,
  } as jest.Mocked<UserRepository>;

  return {
    findById,
    findByEmail,
    findByUsername,
    existsByEmail,
    existsByUsername,
    save,
    findAll,
    delete: deleteMock,
    repository,
  };
}
