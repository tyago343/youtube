import { ExecutionContext } from '@nestjs/common';

export function createExecutionContextMock(): jest.Mocked<ExecutionContext> {
  return {
    getHandler: jest.fn(),
    getClass: jest.fn(),
    switchToHttp: jest.fn(),
    getArgs: jest.fn(),
    getArgByIndex: jest.fn(),
    switchToRpc: jest.fn(),
    switchToWs: jest.fn(),
    getType: jest.fn(),
  } as any;
}
