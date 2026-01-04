import { FileStorageService } from '../../../../shared/application/ports/file-storage.interface';

export interface FileStorageMocks {
  uploadFile: jest.Mock;
  deleteFile: jest.Mock;
  getFileUrl: jest.Mock;
  fileExists: jest.Mock;
  service: jest.Mocked<FileStorageService>;
}

export function createFileStorageMocks(): FileStorageMocks {
  const uploadFile = jest.fn();
  const deleteFile = jest.fn();
  const getFileUrl = jest.fn();
  const fileExists = jest.fn();

  const service = {
    uploadFile,
    deleteFile,
    getFileUrl,
    fileExists,
  } as jest.Mocked<FileStorageService>;

  return {
    uploadFile,
    deleteFile,
    getFileUrl,
    fileExists,
    service,
  };
}
