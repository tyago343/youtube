import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportSchema } from './infrastructure/persistence/typeorm/entities/report.schema';
import { ReportWatcherSchema } from './infrastructure/persistence/typeorm/entities/report-watcher.schema';
import { ReportsPresentersModule } from './presenters/reports.presenters';
@Module({
  imports: [
    TypeOrmModule.forFeature([ReportSchema, ReportWatcherSchema]),
    ReportsPresentersModule,
  ],
})
export class ReportsModule {}
