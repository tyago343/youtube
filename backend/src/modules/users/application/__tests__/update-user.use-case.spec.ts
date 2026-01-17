import { Test, TestingModule } from '@nestjs/testing';
import { UpdateUserUseCase } from '../use-cases/update-user.use-case';
import { UserRepository } from '../ports/user.repository';
import { User } from '../../domain/user.entity';
import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception';
import { UserAlreadyExistsException } from '../../domain/exceptions/user-already-exists.exceptions';
import { randomUUID } from 'crypto';
import { createUserRepositoryMocks } from './mocks';

describe('UpdateUserUseCase', () => {
  let useCase: UpdateUserUseCase;
  let userRepositoryMocks: ReturnType<typeof createUserRepositoryMocks>;

  const userId = randomUUID();
  const email = 'test@example.com';
  const username = 'testuser';
  const hashedPassword = '$2b$10$hashedpasswordstringhere';

  beforeEach(async () => {
    userRepositoryMocks = createUserRepositoryMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateUserUseCase,
        {
          provide: UserRepository,
          useValue: userRepositoryMocks.repository,
        },
      ],
    }).compile();

    useCase = module.get<UpdateUserUseCase>(UpdateUserUseCase);
  });

  it('should update email successfully', async () => {
    const user = User.create({
      id: userId,
      email: email,
      username: username,
      hashedPassword: hashedPassword,
    });
    const newEmail = 'newemail@example.com';

    userRepositoryMocks.findById.mockResolvedValue(user);
    userRepositoryMocks.existsByEmail.mockResolvedValue(false);
    userRepositoryMocks.save.mockResolvedValue(user);

    const result = await useCase.execute(userId, { email: newEmail });

    expect(result.email.value).toBe(newEmail);
    expect(userRepositoryMocks.findById).toHaveBeenCalledTimes(1);
    expect(userRepositoryMocks.existsByEmail).toHaveBeenCalledTimes(1);
    expect(userRepositoryMocks.save).toHaveBeenCalledTimes(1);
  });

  it('should update username successfully', async () => {
    const user = User.create({
      id: userId,
      email: email,
      username: username,
      hashedPassword: hashedPassword,
    });
    const newUsername = 'newusername';

    userRepositoryMocks.findById.mockResolvedValue(user);
    userRepositoryMocks.existsByUsername.mockResolvedValue(false);
    userRepositoryMocks.save.mockResolvedValue(user);

    const result = await useCase.execute(userId, { username: newUsername });

    expect(result.username.value).toBe(newUsername);
    expect(userRepositoryMocks.findById).toHaveBeenCalledTimes(1);
    expect(userRepositoryMocks.existsByUsername).toHaveBeenCalledTimes(1);
    expect(userRepositoryMocks.save).toHaveBeenCalledTimes(1);
  });

  it('should update both fields when provided', async () => {
    const user = User.create({
      id: userId,
      email: email,
      username: username,
      hashedPassword: hashedPassword,
    });
    const newEmail = 'newemail@example.com';
    const newUsername = 'newusername';

    userRepositoryMocks.findById.mockResolvedValue(user);
    userRepositoryMocks.existsByEmail.mockResolvedValue(false);
    userRepositoryMocks.existsByUsername.mockResolvedValue(false);
    userRepositoryMocks.save.mockResolvedValue(user);

    const result = await useCase.execute(userId, {
      email: newEmail,
      username: newUsername,
    });

    expect(result.email.value).toBe(newEmail);
    expect(result.username.value).toBe(newUsername);
    expect(userRepositoryMocks.save).toHaveBeenCalledTimes(1);
  });

  it('should throw UserNotFoundException when user does not exist', async () => {
    userRepositoryMocks.findById.mockResolvedValue(null);

    await expect(
      useCase.execute(userId, { email: 'newemail@example.com' }),
    ).rejects.toThrow(UserNotFoundException);

    expect(userRepositoryMocks.findById).toHaveBeenCalledTimes(1);
    expect(userRepositoryMocks.save).not.toHaveBeenCalled();
  });

  it('should throw UserAlreadyExistsException when email already exists in another user', async () => {
    const user = User.create({
      id: userId,
      email: email,
      username: username,
      hashedPassword: hashedPassword,
    });
    const newEmail = 'existing@example.com';

    userRepositoryMocks.findById.mockResolvedValue(user);
    userRepositoryMocks.existsByEmail.mockResolvedValue(true);

    await expect(useCase.execute(userId, { email: newEmail })).rejects.toThrow(
      UserAlreadyExistsException,
    );

    expect(userRepositoryMocks.save).not.toHaveBeenCalled();
  });

  it('should throw UserAlreadyExistsException when username already exists in another user', async () => {
    const user = User.create({
      id: userId,
      email: email,
      username: username,
      hashedPassword: hashedPassword,
    });
    const newUsername = 'existinguser';

    userRepositoryMocks.findById.mockResolvedValue(user);
    userRepositoryMocks.existsByUsername.mockResolvedValue(true);

    await expect(
      useCase.execute(userId, { username: newUsername }),
    ).rejects.toThrow(UserAlreadyExistsException);

    expect(userRepositoryMocks.save).not.toHaveBeenCalled();
  });

  it('should allow updating to the same email of the user', async () => {
    const user = User.create({
      id: userId,
      email: email,
      username: username,
      hashedPassword: hashedPassword,
    });

    userRepositoryMocks.findById.mockResolvedValue(user);
    userRepositoryMocks.existsByEmail.mockResolvedValue(true);
    userRepositoryMocks.save.mockResolvedValue(user);

    const result = await useCase.execute(userId, { email });

    expect(result.email.value).toBe(email);
    expect(userRepositoryMocks.save).toHaveBeenCalledTimes(1);
  });

  it('should allow updating to the same username of the user', async () => {
    const user = User.create({
      id: userId,
      email: email,
      username: username,
      hashedPassword: hashedPassword,
    });

    userRepositoryMocks.findById.mockResolvedValue(user);
    userRepositoryMocks.existsByUsername.mockResolvedValue(true);
    userRepositoryMocks.save.mockResolvedValue(user);

    const result = await useCase.execute(userId, { username });

    expect(result.username.value).toBe(username);
    expect(userRepositoryMocks.save).toHaveBeenCalledTimes(1);
  });

  it('should not update anything when no data is provided', async () => {
    const user = User.create({
      id: userId,
      email: email,
      username: username,
      hashedPassword: hashedPassword,
    });

    userRepositoryMocks.findById.mockResolvedValue(user);
    userRepositoryMocks.save.mockResolvedValue(user);

    const result = await useCase.execute(userId, {});

    expect(result.email.value).toBe(email);
    expect(result.username.value).toBe(username);
    expect(userRepositoryMocks.save).toHaveBeenCalledTimes(1);
  });
});
