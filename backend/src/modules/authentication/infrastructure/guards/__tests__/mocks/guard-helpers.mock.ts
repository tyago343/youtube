import { AuthGuard } from '@nestjs/passport';

/**
 * Mocks the parent class's canActivate method for a guard that extends AuthGuard
 * @param guardPrototype The prototype of the guard class
 * @param mockCanActivate The mock function to use for canActivate
 */
export function mockParentCanActivate(
  guardPrototype: any,
  mockCanActivate: jest.Mock,
): jest.SpyInstance {
  return jest
    .spyOn(Object.getPrototypeOf(guardPrototype), 'canActivate')
    .mockImplementation(mockCanActivate);
}
