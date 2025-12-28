import { Module } from '@nestjs/common';
import { SharedInfrastructureModule } from './infrastructure/shared.infrastructure';
import { StorageInfrastructureModule } from './infrastructure/storage/storage.infrastructure';
import { DatabaseInfrastructureModule } from './infrastructure/database/database.infrastructure';

@Module({
  imports: [
    SharedInfrastructureModule,
    StorageInfrastructureModule,
    DatabaseInfrastructureModule,
  ],
  exports: [
    SharedInfrastructureModule,
    StorageInfrastructureModule,
    DatabaseInfrastructureModule,
  ],
})
export class SharedModule {}
