import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SanctionReportSchema } from './persistence/typeorm/entities/sanction-report.schema';
import { SanctionSchema } from './persistence/typeorm/entities/sanction.schema';
import { SanctionRepository } from '../application/ports/sanction.repository';
import { VideosInfrastructureModule } from 'src/modules/videos/infrastructure/videos.infrastructure';
import { OrmSanctionRepository } from './persistence/typeorm/repositories/orm-sanction.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([SanctionSchema, SanctionReportSchema]),
    VideosInfrastructureModule,
  ],
  providers: [
    {
      provide: SanctionRepository,
      useClass: OrmSanctionRepository,
    },
  ],
  exports: [SanctionRepository],
})
export class SanctionsInfrastructureModule {}
