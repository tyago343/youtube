import { Module } from '@nestjs/common';
import { SharedInfrastructureModule } from './infrastructure/shared.infrastructure';

@Module({
  imports: [SharedInfrastructureModule],
  exports: [SharedInfrastructureModule],
})
export class SharedModule {}
