import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';
import { JwtAuthGuard } from '../jwt-authentication.guard';
import { PUBLIC_KEY } from '../../../presenters/http/decorators/public.decorator';
import {
  createExecutionContextMock,
  createReflectorMock,
  mockParentCanActivate,
} from './mocks';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let reflector: Reflector;
  let mockExecutionContext: jest.Mocked<ExecutionContext>;
  let mockCanActivate: jest.Mock;

  beforeEach(async () => {
    mockExecutionContext = createExecutionContextMock();
    mockCanActivate = jest.fn();

    const reflectorMock = createReflectorMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtAuthGuard,
        {
          provide: Reflector,
          useValue: reflectorMock,
        },
      ],
    }).compile();

    guard = module.get<JwtAuthGuard>(JwtAuthGuard);
    reflector = module.get<Reflector>(Reflector);

    mockParentCanActivate(JwtAuthGuard.prototype, mockCanActivate);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('canActivate', () => {
    it('should return true when route is marked as public', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true);

      const result = guard.canActivate(mockExecutionContext);

      expect(result).toBe(true);
      expect(reflector.getAllAndOverride).toHaveBeenCalledWith(PUBLIC_KEY, [
        mockExecutionContext.getHandler(),
        mockExecutionContext.getClass(),
      ]);
      expect(mockCanActivate).not.toHaveBeenCalled();
    });

    it('should call parent canActivate when route is not public', async () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
      mockCanActivate.mockResolvedValue(true);

      const result = await guard.canActivate(mockExecutionContext);

      expect(result).toBe(true);
      expect(reflector.getAllAndOverride).toHaveBeenCalledWith(PUBLIC_KEY, [
        mockExecutionContext.getHandler(),
        mockExecutionContext.getClass(),
      ]);
      expect(mockCanActivate).toHaveBeenCalledWith(mockExecutionContext);
    });

    it('should call parent canActivate when PUBLIC_KEY metadata is undefined', async () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);
      mockCanActivate.mockResolvedValue(true);

      await guard.canActivate(mockExecutionContext);

      expect(reflector.getAllAndOverride).toHaveBeenCalledWith(PUBLIC_KEY, [
        mockExecutionContext.getHandler(),
        mockExecutionContext.getClass(),
      ]);
      expect(mockCanActivate).toHaveBeenCalledWith(mockExecutionContext);
    });

    it('should propagate errors from parent canActivate', async () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
      const error = new Error('Authentication failed');
      mockCanActivate.mockRejectedValue(error);

      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
        error,
      );
      expect(mockCanActivate).toHaveBeenCalledWith(mockExecutionContext);
    });
  });
});
