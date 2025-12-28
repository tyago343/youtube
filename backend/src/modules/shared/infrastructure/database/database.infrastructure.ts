import { Module } from '@nestjs/common';
import { DatabaseConfigService } from '../../application/ports/database-config.interface';
import { PostgresDatabaseConfigService } from './postgres/postgres-database.config';

@Module({
  providers: [
    {
      provide: DatabaseConfigService,
      useClass: PostgresDatabaseConfigService,
    },
  ],
  exports: [DatabaseConfigService],
})
export class DatabaseInfrastructureModule {}
