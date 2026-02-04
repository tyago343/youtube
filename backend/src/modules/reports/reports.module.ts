import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportSchema } from './infrastructure/persistence/typeorm/entities/report.schema';
import { ReportWatcherSchema } from './infrastructure/persistence/typeorm/entities/report-watcher.schema';
import { ReportsPresentersModule } from './presenters/reports.presenters';
import { ReportsInfrastructureModule } from './infrastructure/reports.infrestructure';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReportSchema, ReportWatcherSchema]),
    ReportsInfrastructureModule,
    ReportsPresentersModule,
  ],
})
export class ReportsModule {}
