import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException } from '@nestjs/common';
import { ModerationLoginUseCase } from '../use-cases/moderation-login.use-case';
import { TokenService } from '../ports/token.service.interface';
import { User } from 'src/modules/users/domain/user.entity';
import { UserRole } from 'src/modules/users/domain/vo/user-role.vo';
import { AccessToken } from '../../domain/vo/access-token.vo';
import { RefreshToken } from '../../domain/vo/refresh-token.vo';
import { TokenPayload } from '../../domain/vo/token-payload.vo';
import { randomUUID } from 'crypto';
import { createTokenServiceMocks } from './mocks';

describe('ModerationLoginUseCase', () => {
  let useCase: ModerationLoginUseCase;
  let tokenServiceMocks: ReturnType<typeof createTokenServiceMocks>;

  const userId = randomUUID();
  const email = 'test@example.com';
  const username = 'testuser';
  const hashedPassword = '$2b$10$hashedpasswordstringhere';

  beforeEach(async () => {
    tokenServiceMocks = createTokenServiceMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ModerationLoginUseCase,
        {
          provide: TokenService,
          useValue: tokenServiceMocks.service,
        },
      ],
    }).compile();

    useCase = module.get<ModerationLoginUseCase>(ModerationLoginUseCase);
  });

  describe('execute', () => {
    it('should generate tokens for a user with MODERATOR role', async () => {
      const user = User.create({
        id: userId,
        email: email,
        username: username,
        hashedPassword: hashedPassword,
        role: UserRole.MODERATOR,
      });
      const accessToken = AccessToken.create('access-token');
      const refreshToken = RefreshToken.create('refresh-token');

      tokenServiceMocks.generateToken.mockResolvedValue(accessToken);
      tokenServiceMocks.generateRefreshToken.mockResolvedValue(refreshToken);

      const result = await useCase.execute(user);

      expect(result).toEqual({
        accessToken,
        refreshToken,
        user,
      });
      expect(tokenServiceMocks.generateToken).toHaveBeenCalledTimes(1);
      expect(tokenServiceMocks.generateRefreshToken).toHaveBeenCalledTimes(1);
    });

    it('should generate tokens for a user with LEGAL role', async () => {
      const user = User.create({
        id: userId,
        email: email,
        username: username,
        hashedPassword: hashedPassword,
        role: UserRole.LEGAL,
      });
      const accessToken = AccessToken.create('access-token');
      const refreshToken = RefreshToken.create('refresh-token');

      tokenServiceMocks.generateToken.mockResolvedValue(accessToken);
      tokenServiceMocks.generateRefreshToken.mockResolvedValue(refreshToken);

      const result = await useCase.execute(user);

      expect(result).toEqual({
        accessToken,
        refreshToken,
        user,
      });
    });

    it('should throw ForbiddenException for a user with USER role', async () => {
      const user = User.create({
        id: userId,
        email: email,
        username: username,
        hashedPassword: hashedPassword,
        role: UserRole.USER,
      });

      await expect(useCase.execute(user)).rejects.toThrow(ForbiddenException);
      await expect(useCase.execute(user)).rejects.toThrow(
        'Access denied. Only MODERATOR or LEGAL users can access the moderation hub.',
      );
      expect(tokenServiceMocks.generateToken).not.toHaveBeenCalled();
      expect(tokenServiceMocks.generateRefreshToken).not.toHaveBeenCalled();
    });

    it('should create TokenPayload with correct user id, email and role', async () => {
      const user = User.create({
        id: userId,
        email: email,
        username: username,
        hashedPassword: hashedPassword,
        role: UserRole.MODERATOR,
      });
      const accessToken = AccessToken.create('access-token');
      const refreshToken = RefreshToken.create('refresh-token');

      tokenServiceMocks.generateToken.mockResolvedValue(accessToken);
      tokenServiceMocks.generateRefreshToken.mockResolvedValue(refreshToken);

      await useCase.execute(user);

      const generateTokenCall =
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        tokenServiceMocks.generateToken.mock.calls[0][0] as TokenPayload;

      expect(generateTokenCall).toBeInstanceOf(TokenPayload);
      expect(generateTokenCall.userId).toBe(userId);
      expect(generateTokenCall.email).toBe(email);
      expect(generateTokenCall.role).toBe('MODERATOR');
    });

    it('should return the same user object passed as parameter', async () => {
      const user = User.create({
        id: userId,
        email: email,
        username: username,
        hashedPassword: hashedPassword,
        role: UserRole.LEGAL,
      });
      const accessToken = AccessToken.create('access-token');
      const refreshToken = RefreshToken.create('refresh-token');

      tokenServiceMocks.generateToken.mockResolvedValue(accessToken);
      tokenServiceMocks.generateRefreshToken.mockResolvedValue(refreshToken);

      const result = await useCase.execute(user);

      expect(result.user).toBe(user);
    });

    it('should handle token generation errors', async () => {
      const user = User.create({
        id: userId,
        email: email,
        username: username,
        hashedPassword: hashedPassword,
        role: UserRole.MODERATOR,
      });
      const error = new Error('Token generation failed');

      tokenServiceMocks.generateToken.mockRejectedValue(error);

      await expect(useCase.execute(user)).rejects.toThrow(error);
    });
  });
});
