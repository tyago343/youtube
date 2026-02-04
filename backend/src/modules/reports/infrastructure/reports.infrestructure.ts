import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportSchema } from './persistence/typeorm/entities/report.schema';
import { OrmReportRepository } from './persistence/typeorm/repositories/orm-report.repository';
import { ReportsRepository } from '../application/ports/reports.repository';
import { VideosInfrastructureModule } from 'src/modules/videos/infrastructure/videos.infrastructure';
import { ChannelsInfrastructureModule } from 'src/modules/channels/infrastructure/channels.infrastructure';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReportSchema]),
    VideosInfrastructureModule,
    ChannelsInfrastructureModule,
  ],
  providers: [
    {
      provide: ReportsRepository,
      useClass: OrmReportRepository,
    },
  ],
  exports: [ReportsRepository],
})
export class ReportsInfrastructureModule {}
