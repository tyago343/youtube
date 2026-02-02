import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportSchema } from './infrastructure/persistence/typeorm/entities/report.schema';
import { ReportWatcherSchema } from './infrastructure/persistence/typeorm/entities/report-watcher.schema';
import { OrmReportRepository } from './infrastructure/persistence/typeorm/repositories/orm-report.repository';
import { OrmReportWatcherRepository } from './infrastructure/persistence/typeorm/repositories/orm-report-watcher.repository';
import { ReportsPresentersModule } from './presenters/reports.presenters';
import { ReportsRepository } from './application/ports/reports.repository';
import { ReportWatcherRepository } from './application/ports/report-watcher.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReportSchema, ReportWatcherSchema]),
    ReportsPresentersModule,
  ],
  providers: [
    {
      provide: ReportsRepository,
      useClass: OrmReportRepository,
    },
    {
      provide: ReportWatcherRepository,
      useClass: OrmReportWatcherRepository,
    },
  ],
  exports: [ReportsRepository, ReportWatcherRepository],
})
export class ReportsModule {}
