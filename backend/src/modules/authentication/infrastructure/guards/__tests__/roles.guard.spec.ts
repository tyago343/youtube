import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { RolesGuard } from '../roles.guard';
import { PUBLIC_KEY } from '../../../presenters/http/decorators/public.decorator';
import { ROLES_KEY } from '../../../presenters/http/decorators/roles.decorator';
import { createExecutionContextMock, createReflectorMock } from './mocks';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: jest.Mocked<Reflector>;
  let mockExecutionContext: jest.Mocked<ExecutionContext>;

  beforeEach(async () => {
    mockExecutionContext = createExecutionContextMock();
    const reflectorMock = createReflectorMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesGuard,
        {
          provide: Reflector,
          useValue: reflectorMock,
        },
      ],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
    reflector = module.get(Reflector);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  function mockRequest(user?: { userId: string; email: string; role: string }) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    mockExecutionContext.switchToHttp.mockReturnValue({
      getRequest: () => ({ user }),
    } as any);
  }

  describe('canActivate', () => {
    it('should return true when route is marked as public', () => {
      reflector.getAllAndOverride
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(['MODERATOR']);

      const result = guard.canActivate(mockExecutionContext);

      expect(result).toBe(true);
      expect(reflector.getAllAndOverride).toHaveBeenCalledWith(PUBLIC_KEY, [
        mockExecutionContext.getHandler(),
        mockExecutionContext.getClass(),
      ]);
    });

    it('should return true when no roles are required', () => {
      reflector.getAllAndOverride
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(undefined);

      const result = guard.canActivate(mockExecutionContext);

      expect(result).toBe(true);
    });

    it('should return true when required roles is empty array', () => {
      reflector.getAllAndOverride
        .mockReturnValueOnce(false)
        .mockReturnValueOnce([]);

      const result = guard.canActivate(mockExecutionContext);

      expect(result).toBe(true);
    });

    it('should return true when user has a required role', () => {
      reflector.getAllAndOverride
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(['MODERATOR', 'LEGAL']);
      mockRequest({
        userId: 'user-123',
        email: 'moderator@example.com',
        role: 'MODERATOR',
      });

      const result = guard.canActivate(mockExecutionContext);

      expect(result).toBe(true);
    });

    it('should return true when user has LEGAL role and LEGAL is required', () => {
      reflector.getAllAndOverride
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(['LEGAL']);
      mockRequest({
        userId: 'user-123',
        email: 'legal@example.com',
        role: 'LEGAL',
      });

      const result = guard.canActivate(mockExecutionContext);

      expect(result).toBe(true);
    });

    it('should throw ForbiddenException when user is not authenticated', () => {
      reflector.getAllAndOverride
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(['MODERATOR']);
      mockRequest(undefined);

      expect(() => guard.canActivate(mockExecutionContext)).toThrow(
        new ForbiddenException('User not authenticated'),
      );
    });

    it('should throw ForbiddenException when user lacks required role', () => {
      reflector.getAllAndOverride
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(['MODERATOR', 'LEGAL']);
      mockRequest({
        userId: 'user-123',
        email: 'user@example.com',
        role: 'USER',
      });

      expect(() => guard.canActivate(mockExecutionContext)).toThrow(
        new ForbiddenException(
          'Access denied. Required roles: MODERATOR, LEGAL',
        ),
      );
    });

    it('should throw ForbiddenException when MODERATOR tries to access LEGAL-only route', () => {
      reflector.getAllAndOverride
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(['LEGAL']);
      mockRequest({
        userId: 'user-123',
        email: 'moderator@example.com',
        role: 'MODERATOR',
      });

      expect(() => guard.canActivate(mockExecutionContext)).toThrow(
        new ForbiddenException('Access denied. Required roles: LEGAL'),
      );
    });

    it('should check ROLES_KEY metadata correctly', () => {
      reflector.getAllAndOverride
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(['MODERATOR']);
      mockRequest({
        userId: 'user-123',
        email: 'moderator@example.com',
        role: 'MODERATOR',
      });

      guard.canActivate(mockExecutionContext);

      expect(reflector.getAllAndOverride).toHaveBeenCalledWith(ROLES_KEY, [
        mockExecutionContext.getHandler(),
        mockExecutionContext.getClass(),
      ]);
    });
  });
});
