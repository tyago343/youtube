import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';
import { LocalAuthenticationGuard } from '../local-authentication.guard';
import { createExecutionContextMock, mockParentCanActivate } from './mocks';

describe('LocalAuthenticationGuard', () => {
  let guard: LocalAuthenticationGuard;
  let mockExecutionContext: jest.Mocked<ExecutionContext>;
  let mockCanActivate: jest.Mock;

  beforeEach(async () => {
    mockExecutionContext = createExecutionContextMock();
    mockCanActivate = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [LocalAuthenticationGuard],
    }).compile();

    guard = module.get<LocalAuthenticationGuard>(LocalAuthenticationGuard);

    mockParentCanActivate(LocalAuthenticationGuard.prototype, mockCanActivate);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('canActivate', () => {
    it('should call parent canActivate method', async () => {
      mockCanActivate.mockResolvedValue(true);

      await guard.canActivate(mockExecutionContext);

      expect(mockCanActivate).toHaveBeenCalledWith(mockExecutionContext);
      expect(mockCanActivate).toHaveBeenCalledTimes(1);
    });

    it('should return the result from parent canActivate', async () => {
      mockCanActivate.mockResolvedValue(true);

      const result = await guard.canActivate(mockExecutionContext);

      expect(result).toBe(true);
      expect(mockCanActivate).toHaveBeenCalledWith(mockExecutionContext);
    });

    it('should propagate errors from parent canActivate', async () => {
      const error = new Error('Authentication failed');
      mockCanActivate.mockRejectedValue(error);

      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
        error,
      );
      expect(mockCanActivate).toHaveBeenCalledWith(mockExecutionContext);
    });

    it('should handle false result from parent canActivate', async () => {
      mockCanActivate.mockResolvedValue(false);

      const result = await guard.canActivate(mockExecutionContext);

      expect(result).toBe(false);
      expect(mockCanActivate).toHaveBeenCalledWith(mockExecutionContext);
    });
  });
});
