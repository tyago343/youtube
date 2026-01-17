import { Test, TestingModule } from '@nestjs/testing';
import { GetAllUsersUseCase } from '../use-cases/get-all-users.use-case';
import { UserRepository } from '../ports/user.repository';
import { User } from '../../domain/user.entity';
import { randomUUID } from 'crypto';
import { createUserRepositoryMocks } from './mocks';

describe('GetAllUsersUseCase', () => {
  let useCase: GetAllUsersUseCase;
  let userRepositoryMocks: ReturnType<typeof createUserRepositoryMocks>;

  beforeEach(async () => {
    userRepositoryMocks = createUserRepositoryMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAllUsersUseCase,
        {
          provide: UserRepository,
          useValue: userRepositoryMocks.repository,
        },
      ],
    }).compile();

    useCase = module.get<GetAllUsersUseCase>(GetAllUsersUseCase);
  });

  it('should return an empty list when there are no users', async () => {
    userRepositoryMocks.findAll.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result).toEqual([]);
    expect(userRepositoryMocks.findAll).toHaveBeenCalledTimes(1);
  });

  it('should return all users', async () => {
    const user1 = User.create({
      id: randomUUID(),
      email: 'user1@example.com',
      username: 'user1',
      hashedPassword: '$2b$10$hashedpasswordstringhere',
    });
    const user2 = User.create({
      id: randomUUID(),
      email: 'user2@example.com',
      username: 'user2',
      hashedPassword: '$2b$10$hashedpasswordstringhere',
    });
    const users = [user1, user2];

    userRepositoryMocks.findAll.mockResolvedValue(users);

    const result = await useCase.execute();

    expect(result).toEqual(users);
    expect(result).toHaveLength(2);
    expect(userRepositoryMocks.findAll).toHaveBeenCalledTimes(1);
  });

  it('should return the correct list of users', async () => {
    const users = [
      User.create({
        id: randomUUID(),
        email: 'user1@example.com',
        username: 'user1',
        hashedPassword: '$2b$10$hashedpasswordstringhere',
      }),
      User.create({
        id: randomUUID(),
        email: 'user2@example.com',
        username: 'user2',
        hashedPassword: '$2b$10$hashedpasswordstringhere',
      }),
      User.create({
        id: randomUUID(),
        email: 'user3@example.com',
        username: 'user3',
        hashedPassword: '$2b$10$hashedpasswordstringhere',
      }),
    ];

    userRepositoryMocks.findAll.mockResolvedValue(users);

    const result = await useCase.execute();

    expect(result).toHaveLength(3);
    expect(result[0].email.value).toBe('user1@example.com');
    expect(result[1].email.value).toBe('user2@example.com');
    expect(result[2].email.value).toBe('user3@example.com');
  });
});
