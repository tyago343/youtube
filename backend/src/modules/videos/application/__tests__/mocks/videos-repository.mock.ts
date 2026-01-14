import { VideosRepository } from '../../ports/videos.repository';

export interface VideosRepositoryMocks {
  create: jest.Mock;
  update: jest.Mock;
  findById: jest.Mock;
  findAll: jest.Mock;
  delete: jest.Mock;
  findByIdWithChannel: jest.Mock;
  findAllWithChannel: jest.Mock;
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

  const repository = {
    create,
    update,
    findById,
    findAll,
    delete: deleteMock,
    findByIdWithChannel,
    findAllWithChannel,
  } as jest.Mocked<VideosRepository>;

  return {
    create,
    update,
    findById,
    findAll,
    delete: deleteMock,
    findByIdWithChannel,
    findAllWithChannel,
    repository,
  };
}
