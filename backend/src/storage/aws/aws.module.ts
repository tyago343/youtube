import { Module } from '@nestjs/common';
import { AwsService } from './aws.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [AwsService],
  exports: [AwsService],
  imports: [ConfigModule],
})
export class AwsModule {}
