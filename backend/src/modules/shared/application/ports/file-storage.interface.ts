export interface UploadFileOptions {
  folder?: string;
  contentType?: string;
  metadata?: Record<string, string>;
}
export interface UploadResult {
  url: string;
  key: string;
  bucket?: string;
}

export abstract class FileStorageService {
  abstract uploadFile(
    file: Express.Multer.File,
    options?: UploadFileOptions,
  ): Promise<UploadResult>;
  abstract deleteFile(key: string): Promise<void>;
  abstract getFileUrl(key: string): string;
  abstract fileExists(key: string): Promise<boolean>;
}
