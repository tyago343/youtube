export class InvalidFileTypeException extends Error {
  constructor(allowedTypes: string[]) {
    super(`File type not allowed. Allowed types: ${allowedTypes.join(', ')}`);
    this.name = 'InvalidFileTypeException';
  }
}
export class InvalidFileSizeException extends Error {
  constructor(maxSize: number) {
    super(`File size exceeds the maximum size of ${maxSize} bytes`);
    this.name = 'InvalidFileSizeException';
  }
}
