import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserUseCase } from '../use-cases/create-user.use-case';
import { UserFactory } from '../../domain/factories/user.factory';
import { UserRepository } from '../ports/user.repository';
import { PasswordHashingService } from '../../../shared/application/ports/password-hashing.interface';
import { EventBus } from '../../../shared/application/ports/event-bus.interface';
import { EventCatalog } from '../../../shared/domain/events';
import { User } from '../../domain/user.entity';
import { UserAlreadyExistsException } from '../../domain/exceptions/user-already-exists.exceptions';
import { Email } from '../../domain/vo/email.vo';
import { Username } from '../../domain/vo/username.vo';
import { randomUUID } from 'crypto';
import {
  createUserRepositoryMocks,
  createPasswordHashingMocks,
  createUserFactoryMocks,
  createEventBusMock,
} from './mocks';

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let userRepositoryMocks: ReturnType<typeof createUserRepositoryMocks>;
  let passwordHashingMocks: ReturnType<typeof createPasswordHashingMocks>;
  let userFactoryMocks: ReturnType<typeof createUserFactoryMocks>;
  let eventBusMocks: ReturnType<typeof createEventBusMock>;

  const validEmail = 'test@example.com';
  const validUsername = 'testuser';
  const validPassword = 'ValidPass123';
  const hashedPassword = '$2b$10$hashedpasswordstringhere';

  beforeEach(async () => {
    userRepositoryMocks = createUserRepositoryMocks();
    passwordHashingMocks = createPasswordHashingMocks();
    userFactoryMocks = createUserFactoryMocks();
    eventBusMocks = createEventBusMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserUseCase,
        {
          provide: UserFactory,
          useValue: userFactoryMocks.factory,
        },
        {
          provide: UserRepository,
          useValue: userRepositoryMocks.repository,
        },
        {
          provide: PasswordHashingService,
          useValue: passwordHashingMocks.service,
        },
        {
          provide: EventBus,
          useValue: eventBusMocks.eventBus,
        },
      ],
    }).compile();

    useCase = module.get<CreateUserUseCase>(CreateUserUseCase);
  });

  it('should create a user successfully', async () => {
    const userId = randomUUID();
    const createdUser = User.create({
      id: userId,
      email: validEmail,
      username: validUsername,
      hashedPassword: hashedPassword,
    });

    userRepositoryMocks.existsByEmail.mockResolvedValue(false);
    userRepositoryMocks.existsByUsername.mockResolvedValue(false);
    passwordHashingMocks.hash.mockResolvedValue(hashedPassword);
    userFactoryMocks.create.mockReturnValue(createdUser);
    userRepositoryMocks.save.mockResolvedValue(createdUser);

    const result = await useCase.execute(
      validEmail,
      validUsername,
      validPassword,
    );

    expect(result).toBe(createdUser);
    expect(userRepositoryMocks.existsByEmail).toHaveBeenCalledWith(
      expect.any(Email),
    );
    expect(userRepositoryMocks.existsByUsername).toHaveBeenCalledWith(
      expect.any(Username),
    );
    expect(passwordHashingMocks.hash).toHaveBeenCalledWith(validPassword);
    expect(userFactoryMocks.create).toHaveBeenCalledWith(
      {
        email: validEmail,
        username: validUsername,
        hashedPassword,
      },
      validUsername,
      hashedPassword,
    );
    expect(userRepositoryMocks.save).toHaveBeenCalledWith(createdUser);
  });

  it('should throw UserAlreadyExistsException when email already exists', async () => {
    userRepositoryMocks.existsByEmail.mockResolvedValue(true);

    await expect(
      useCase.execute(validEmail, validUsername, validPassword),
    ).rejects.toThrow(UserAlreadyExistsException);

    expect(userRepositoryMocks.existsByEmail).toHaveBeenCalledTimes(1);
    expect(userRepositoryMocks.existsByUsername).not.toHaveBeenCalled();
    expect(passwordHashingMocks.hash).not.toHaveBeenCalled();
    expect(userFactoryMocks.create).not.toHaveBeenCalled();
    expect(userRepositoryMocks.save).not.toHaveBeenCalled();
  });

  it('should throw UserAlreadyExistsException when username already exists', async () => {
    userRepositoryMocks.existsByEmail.mockResolvedValue(false);
    userRepositoryMocks.existsByUsername.mockResolvedValue(true);

    await expect(
      useCase.execute(validEmail, validUsername, validPassword),
    ).rejects.toThrow(UserAlreadyExistsException);

    expect(userRepositoryMocks.existsByEmail).toHaveBeenCalledTimes(1);
    expect(userRepositoryMocks.existsByUsername).toHaveBeenCalledTimes(1);
    expect(passwordHashingMocks.hash).not.toHaveBeenCalled();
    expect(userFactoryMocks.create).not.toHaveBeenCalled();
    expect(userRepositoryMocks.save).not.toHaveBeenCalled();
  });

  it('should hash the password before creating the user', async () => {
    const userId = randomUUID();
    const createdUser = User.create({
      id: userId,
      email: validEmail,
      username: validUsername,
      hashedPassword: hashedPassword,
    });

    userRepositoryMocks.existsByEmail.mockResolvedValue(false);
    userRepositoryMocks.existsByUsername.mockResolvedValue(false);
    passwordHashingMocks.hash.mockResolvedValue(hashedPassword);
    userFactoryMocks.create.mockReturnValue(createdUser);
    userRepositoryMocks.save.mockResolvedValue(createdUser);

    await useCase.execute(validEmail, validUsername, validPassword);

    expect(passwordHashingMocks.hash).toHaveBeenCalledWith(validPassword);
    expect(userFactoryMocks.create).toHaveBeenCalledWith(
      validEmail,
      validUsername,
      hashedPassword,
    );
  });

  it('should validate email before creating the user', async () => {
    userRepositoryMocks.existsByEmail.mockResolvedValue(false);
    userRepositoryMocks.existsByUsername.mockResolvedValue(false);
    passwordHashingMocks.hash.mockResolvedValue(hashedPassword);

    const invalidEmail = 'invalid-email';

    await expect(
      useCase.execute(invalidEmail, validUsername, validPassword),
    ).rejects.toThrow();

    expect(userRepositoryMocks.existsByEmail).not.toHaveBeenCalled();
  });

  it('should validate username before creating the user', async () => {
    userRepositoryMocks.existsByEmail.mockResolvedValue(false);
    userRepositoryMocks.existsByUsername.mockResolvedValue(false);
    passwordHashingMocks.hash.mockResolvedValue(hashedPassword);

    const invalidUsername = 'ab'; // Less than 3 characters

    await expect(
      useCase.execute(validEmail, invalidUsername, validPassword),
    ).rejects.toThrow();

    expect(userRepositoryMocks.existsByEmail).not.toHaveBeenCalled();
  });

  it('should emit UserCreatedEvent after successfully creating a user', async () => {
    const userId = randomUUID();
    const createdUser = User.create({
      id: userId,
      email: validEmail,
      username: validUsername,
      hashedPassword: hashedPassword,
    });

    userRepositoryMocks.existsByEmail.mockResolvedValue(false);
    userRepositoryMocks.existsByUsername.mockResolvedValue(false);
    passwordHashingMocks.hash.mockResolvedValue(hashedPassword);
    userFactoryMocks.create.mockReturnValue(createdUser);
    userRepositoryMocks.save.mockResolvedValue(createdUser);

    await useCase.execute(validEmail, validUsername, validPassword);

    expect(eventBusMocks.publish).toHaveBeenCalledTimes(1);
    expect(eventBusMocks.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        eventName: EventCatalog.User.Created,
        payload: {
          email: validEmail,
          username: validUsername,
        },
      }),
    );
  });

  it('should not emit event when user creation fails', async () => {
    userRepositoryMocks.existsByEmail.mockResolvedValue(true);

    await expect(
      useCase.execute(validEmail, validUsername, validPassword),
    ).rejects.toThrow(UserAlreadyExistsException);

    expect(eventBusMocks.publish).not.toHaveBeenCalled();
  });
});
