import { VideosRepository } from '../../ports/videos.repository';

export interface VideosRepositoryMocks {
  create: jest.Mock;
  update: jest.Mock;
  findById: jest.Mock;
  findAll: jest.Mock;
  delete: jest.Mock;
  findByIdWithOwner: jest.Mock;
  findAllWithOwner: jest.Mock;
  repository: jest.Mocked<VideosRepository>;
}

export function createVideosRepositoryMocks(): VideosRepositoryMocks {
  const create = jest.fn();
  const update = jest.fn();
  const findById = jest.fn();
  const findAll = jest.fn();
  const deleteMock = jest.fn();
  const findByIdWithOwner = jest.fn();
  const findAllWithOwner = jest.fn();

  const repository = {
    create,
    update,
    findById,
    findAll,
    delete: deleteMock,
    findByIdWithOwner,
    findAllWithOwner,
  } as jest.Mocked<VideosRepository>;

  return {
    create,
    update,
    findById,
    findAll,
    delete: deleteMock,
    findByIdWithOwner,
    findAllWithOwner,
    repository,
  };
}
