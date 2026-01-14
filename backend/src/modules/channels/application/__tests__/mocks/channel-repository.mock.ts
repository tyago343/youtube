import { ChannelRepository } from '../../ports/channel.repository';

export interface ChannelRepositoryMocks {
  save: jest.Mock;
  findById: jest.Mock;
  findByOwnerId: jest.Mock;
  findAll: jest.Mock;
  findAllByStatus: jest.Mock;
  findAllActive: jest.Mock;
  delete: jest.Mock;
  repository: jest.Mocked<ChannelRepository>;
}

export function createChannelRepositoryMocks(): ChannelRepositoryMocks {
  const save = jest.fn();
  const findById = jest.fn();
  const findByOwnerId = jest.fn();
  const findAll = jest.fn();
  const findAllByStatus = jest.fn();
  const findAllActive = jest.fn();
  const deleteFn = jest.fn();

  const repository = {
    save,
    findById,
    findByOwnerId,
    findAll,
    findAllByStatus,
    findAllActive,
    delete: deleteFn,
  } as jest.Mocked<ChannelRepository>;

  return {
    save,
    findById,
    findByOwnerId,
    findAll,
    findAllByStatus,
    findAllActive,
    delete: deleteFn,
    repository,
  };
}
