import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportSchema } from './infrastructure/persistence/typeorm/entities/report.schema';
import { ReportWatcherSchema } from './infrastructure/persistence/typeorm/entities/report-watcher.schema';
import { OrmReportRepository } from './infrastructure/persistence/typeorm/repositories/orm-report.repository';
import { OrmReportWatcherRepository } from './infrastructure/persistence/typeorm/repositories/orm-report-watcher.repository';
import { REPORT_REPOSITORY } from './application/ports/report.repository';
import { REPORT_WATCHER_REPOSITORY } from './application/ports/report-watcher.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ReportSchema, ReportWatcherSchema])],
  providers: [
    {
      provide: REPORT_REPOSITORY,
      useClass: OrmReportRepository,
    },
    {
      provide: REPORT_WATCHER_REPOSITORY,
      useClass: OrmReportWatcherRepository,
    },
  ],
  exports: [REPORT_REPOSITORY, REPORT_WATCHER_REPOSITORY],
})
export class ReportsModule {}
