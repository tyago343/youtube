// backend/src/modules/shared/infrastructure/storage/storage.infrastructure.ts
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileStorageService } from '../../application/ports/file-storage.interface';
import { MinIOStorageService } from './minio/minio-storage.service';

@Module({
  providers: [
    {
      provide: FileStorageService,
      useFactory: (configService: ConfigService) => {
        const storageType = configService
          .get<string>('STORAGE_TYPE', 'minio')
          .toLowerCase();

        switch (storageType) {
          case 'minio':
            return new MinIOStorageService(configService);
          case 'aws':
          case 'aws-s3':
            // return new AwsS3StorageService(configService);
            // todo: add aws s3 storage service
            break;
          case 'local':
            // return new LocalStorageService(configService);
            // todo: add local storage service
            break;
          default:
            throw new Error(
              `Unsupported storage type: ${storageType}. Supported: minio, aws, local`,
            );
        }
      },
      inject: [ConfigService],
    },
  ],
  exports: [FileStorageService],
})
export class StorageInfrastructureModule {}
