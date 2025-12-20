import { Module } from '@nestjs/common';
import { AwsService } from './aws.service';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from '../../logger/logger.module';

@Module({
  providers: [AwsService],
  exports: [AwsService],
  imports: [ConfigModule, LoggerModule],
})
export class AwsModule {}
