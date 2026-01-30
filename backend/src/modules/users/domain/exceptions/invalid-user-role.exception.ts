export class InvalidUserRoleException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidUserRoleException';
  }
}
