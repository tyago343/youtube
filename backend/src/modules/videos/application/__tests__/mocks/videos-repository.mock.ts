import { VideosRepository } from '../../ports/videos.repository';

export interface VideosRepositoryMocks {
  create: jest.Mock;
  update: jest.Mock;
  findById: jest.Mock;
  findAll: jest.Mock;
  delete: jest.Mock;
  findByIdWithChannel: jest.Mock;
  findAllWithChannel: jest.Mock;
  findAllByVisibilityWithChannel: jest.Mock;
  findByIdAndVisibilityWithChannel: jest.Mock;
  findAllByOwnerIdWithChannel: jest.Mock;
  repository: jest.Mocked<VideosRepository>;
}

export function createVideosRepositoryMocks(): VideosRepositoryMocks {
  const create = jest.fn();
  const update = jest.fn();
  const findById = jest.fn();
  const findAll = jest.fn();
  const deleteMock = jest.fn();
  const findByIdWithChannel = jest.fn();
  const findAllWithChannel = jest.fn();
  const findAllByVisibilityWithChannel = jest.fn();
  const findByIdAndVisibilityWithChannel = jest.fn();
  const findAllByOwnerIdWithChannel = jest.fn();

  const repository = {
    create,
    update,
    findById,
    findAll,
    delete: deleteMock,
    findByIdWithChannel,
    findAllWithChannel,
    findAllByVisibilityWithChannel,
    findByIdAndVisibilityWithChannel,
    findAllByOwnerIdWithChannel,
  } as jest.Mocked<VideosRepository>;

  return {
    create,
    update,
    findById,
    findAll,
    delete: deleteMock,
    findByIdWithChannel,
    findAllWithChannel,
    findAllByVisibilityWithChannel,
    findByIdAndVisibilityWithChannel,
    findAllByOwnerIdWithChannel,
    repository,
  };
}
