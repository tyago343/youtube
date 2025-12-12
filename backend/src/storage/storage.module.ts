import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { AwsModule } from './aws/aws.module';
@Module({
  providers: [StorageService],
  imports: [AwsModule],
  exports: [StorageService],
})
export class StorageModule {}
