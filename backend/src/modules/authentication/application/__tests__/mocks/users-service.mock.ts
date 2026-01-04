import { UsersService } from 'src/modules/users/application/services/users.service';

export interface UsersServiceMocks {
  create: jest.Mock;
  findOne: jest.Mock;
  findAll: jest.Mock;
  update: jest.Mock;
  uploadAvatar: jest.Mock;
  delete: jest.Mock;
  service: Partial<jest.Mocked<UsersService>>;
}

export function createUsersServiceMocks(): UsersServiceMocks {
  const create = jest.fn();
  const findOne = jest.fn();
  const findAll = jest.fn();
  const update = jest.fn();
  const uploadAvatar = jest.fn();
  const deleteMock = jest.fn();

  const service = {
    create,
    findOne,
    findAll,
    update,
    uploadAvatar,
    delete: deleteMock,
  } as Partial<jest.Mocked<UsersService>>;

  return {
    create,
    findOne,
    findAll,
    update,
    uploadAvatar,
    delete: deleteMock,
    service,
  };
}
