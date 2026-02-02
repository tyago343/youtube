import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportSchema } from './persistence/typeorm/entities/report.schema';
import { OrmReportRepository } from './persistence/typeorm/repositories/orm-report.repository';
import { ReportsRepository } from '../application/ports/reports.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ReportSchema])],
  providers: [
    {
      provide: ReportsRepository,
      useClass: OrmReportRepository,
    },
  ],
  exports: [ReportsRepository],
})
export class ReportsInfrastructureModule {}
