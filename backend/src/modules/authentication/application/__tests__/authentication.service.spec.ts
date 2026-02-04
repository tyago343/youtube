import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationService } from '../services/authentication.service';
import { SignUpUseCase } from '../use-cases/sign-up.use-case';
import { LoginUseCase } from '../use-cases/login.use-case';
import { RefreshTokenUseCase } from '../use-cases/refresh-token.use-case';
import { ValidateUserUseCase } from '../use-cases/validate-user.use-case';
import { GetUserUseCase } from 'src/modules/users/application/use-cases/get-user.use-case';
import { User } from 'src/modules/users/domain/user.entity';
import { AccessToken } from '../../domain/vo/access-token.vo';
import { RefreshToken } from '../../domain/vo/refresh-token.vo';
import { UserAlreadyExistsException } from 'src/modules/users/domain/exceptions/user-already-exists.exceptions';
import { InvalidCredentialsException } from '../../domain/exceptions/invalid-crendetials.exception';
import { randomUUID } from 'crypto';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let signUpUseCase: jest.Mocked<SignUpUseCase>;
  let loginUseCase: jest.Mocked<LoginUseCase>;
  let refreshTokenUseCase: jest.Mocked<RefreshTokenUseCase>;
  let validateUserUseCase: jest.Mocked<ValidateUserUseCase>;
  let getUserUseCase: jest.Mocked<GetUserUseCase>;

  const userId = randomUUID();
  const email = 'test@example.com';
  const username = 'testuser';
  const password = 'ValidPass123';
  const hashedPassword = '$2b$10$hashedpasswordstringhere';

  beforeEach(async () => {
    const signUpUseCaseMock = {
      execute: jest.fn(),
    };
    const loginUseCaseMock = {
      execute: jest.fn(),
    };
    const refreshTokenUseCaseMock = {
      execute: jest.fn(),
    };
    const validateUserUseCaseMock = {
      execute: jest.fn(),
    };
    const getUserUseCaseMock = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthenticationService,
        {
          provide: SignUpUseCase,
          useValue: signUpUseCaseMock,
        },
        {
          provide: LoginUseCase,
          useValue: loginUseCaseMock,
        },
        {
          provide: RefreshTokenUseCase,
          useValue: refreshTokenUseCaseMock,
        },
        {
          provide: ValidateUserUseCase,
          useValue: validateUserUseCaseMock,
        },
        {
          provide: GetUserUseCase,
          useValue: getUserUseCaseMock,
        },
      ],
    }).compile();

    service = module.get<AuthenticationService>(AuthenticationService);
    signUpUseCase = module.get(SignUpUseCase);
    loginUseCase = module.get(LoginUseCase);
    refreshTokenUseCase = module.get(RefreshTokenUseCase);
    validateUserUseCase = module.get(ValidateUserUseCase);
    getUserUseCase = module.get(GetUserUseCase);
  });

  describe('signUp', () => {
    it('should create a user and return tokens', async () => {
      const user = User.create({
        id: userId,
        email: email,
        username: username,
        hashedPassword: hashedPassword,
      });
      const accessToken = AccessToken.create('access-token');
      const refreshToken = RefreshToken.create('refresh-token');

      signUpUseCase.execute.mockResolvedValue({
        accessToken,
        refreshToken,
        user,
      });

      const result = await service.signUp(email, username, password);

      expect(result).toEqual({
        accessToken,
        refreshToken,
        user,
      });
      expect(signUpUseCase.execute).toHaveBeenCalledWith(
        email,
        username,
        password,
      );
    });

    it('should throw ConflictException when user already exists', async () => {
      const error = new UserAlreadyExistsException(
        'email',
        'User already exists',
      );

      signUpUseCase.execute.mockRejectedValue(error);

      await expect(service.signUp(email, username, password)).rejects.toThrow(
        UserAlreadyExistsException,
      );
      expect(signUpUseCase.execute).toHaveBeenCalledWith(
        email,
        username,
        password,
      );
    });

    it('should preserve error message when throwing ConflictException', async () => {
      const errorMessage = 'User with this email already exists';
      const error = new UserAlreadyExistsException('email', errorMessage);

      signUpUseCase.execute.mockRejectedValue(error);

      await expect(service.signUp(email, username, password)).rejects.toThrow(
        errorMessage,
      );
    });

    it('should propagate other errors without transformation', async () => {
      const error = new Error('Unexpected error');

      signUpUseCase.execute.mockRejectedValue(error);

      await expect(service.signUp(email, username, password)).rejects.toThrow(
        error,
      );
    });
  });

  describe('login', () => {
    it('should validate user and return tokens', async () => {
      const user = User.create({
        id: userId,
        email: email,
        username: username,
        hashedPassword: hashedPassword,
      });
      const accessToken = AccessToken.create('access-token');
      const refreshToken = RefreshToken.create('refresh-token');

      validateUserUseCase.execute.mockResolvedValue(user);
      loginUseCase.execute.mockResolvedValue({
        accessToken,
        refreshToken,
        user,
      });

      const result = await service.login(email, password);

      expect(result).toEqual({
        accessToken,
        refreshToken,
        user,
      });
      expect(validateUserUseCase.execute).toHaveBeenCalledWith(email, password);
      expect(loginUseCase.execute).toHaveBeenCalledWith(user);
    });

    it('should propagate validation errors', async () => {
      const error = new InvalidCredentialsException();

      validateUserUseCase.execute.mockRejectedValue(error);

      await expect(service.login(email, password)).rejects.toThrow(error);
      expect(validateUserUseCase.execute).toHaveBeenCalledWith(email, password);
      expect(loginUseCase.execute).not.toHaveBeenCalled();
    });

    it('should propagate login errors', async () => {
      const user = User.create({
        id: userId,
        email: email,
        username: username,
        hashedPassword: hashedPassword,
      });
      const error = new Error('Login failed');

      validateUserUseCase.execute.mockResolvedValue(user);
      loginUseCase.execute.mockRejectedValue(error);

      await expect(service.login(email, password)).rejects.toThrow(error);
      expect(validateUserUseCase.execute).toHaveBeenCalledWith(email, password);
      expect(loginUseCase.execute).toHaveBeenCalledWith(user);
    });
  });

  describe('refreshToken', () => {
    it('should refresh tokens successfully', async () => {
      const refreshTokenString = 'refresh-token';
      const accessToken = AccessToken.create('new-access-token');
      const refreshToken = RefreshToken.create('new-refresh-token');

      refreshTokenUseCase.execute.mockResolvedValue({
        accessToken,
        refreshToken,
      });

      const result = await service.refreshToken(refreshTokenString);

      expect(result).toEqual({
        accessToken,
        refreshToken,
      });
      expect(refreshTokenUseCase.execute).toHaveBeenCalledWith(
        refreshTokenString,
      );
    });

    it('should propagate refresh token errors', async () => {
      const refreshTokenString = 'invalid-token';
      const error = new Error('Token refresh failed');

      refreshTokenUseCase.execute.mockRejectedValue(error);

      await expect(service.refreshToken(refreshTokenString)).rejects.toThrow(
        error,
      );
      expect(refreshTokenUseCase.execute).toHaveBeenCalledWith(
        refreshTokenString,
      );
    });
  });

  describe('validateUser', () => {
    it('should validate user credentials', async () => {
      const user = User.create({
        id: userId,
        email: email,
        username: username,
        hashedPassword: hashedPassword,
      });

      validateUserUseCase.execute.mockResolvedValue(user);

      const result = await service.validateUser(email, password);

      expect(result).toBe(user);
      expect(validateUserUseCase.execute).toHaveBeenCalledWith(email, password);
    });

    it('should propagate validation errors', async () => {
      const error = new InvalidCredentialsException();

      validateUserUseCase.execute.mockRejectedValue(error);

      await expect(service.validateUser(email, password)).rejects.toThrow(
        error,
      );
      expect(validateUserUseCase.execute).toHaveBeenCalledWith(email, password);
    });
  });

  describe('getUser', () => {
    it('should get user by identifier', async () => {
      const user = User.create({
        id: userId,
        email: email,
        username: username,
        hashedPassword: hashedPassword,
      });
      const identifier = userId;

      getUserUseCase.execute.mockResolvedValue(user);

      const result = await service.getUser(identifier);

      expect(result).toBe(user);
      expect(getUserUseCase.execute).toHaveBeenCalledWith(identifier);
    });

    it('should propagate getUser errors', async () => {
      const identifier = userId;
      const error = new Error('User not found');

      getUserUseCase.execute.mockRejectedValue(error);

      await expect(service.getUser(identifier)).rejects.toThrow(error);
      expect(getUserUseCase.execute).toHaveBeenCalledWith(identifier);
    });
  });
});
