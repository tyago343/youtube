import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'ROLES';

export type UserRoleType = 'USER' | 'MODERATOR' | 'LEGAL';

export const Roles = (...roles: UserRoleType[]) =>
  SetMetadata(ROLES_KEY, roles);

export const RequireModerator = () => Roles('MODERATOR', 'LEGAL');

export const RequireLegal = () => Roles('LEGAL');
