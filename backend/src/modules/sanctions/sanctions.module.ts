import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SanctionSchema } from './infrastructure/persistence/typeorm/entities/sanction.schema';
import { SanctionReportSchema } from './infrastructure/persistence/typeorm/entities/sanction-report.schema';
import { OrmSanctionRepository } from './infrastructure/persistence/typeorm/repositories/orm-sanction.repository';
import { SANCTION_REPOSITORY } from './application/ports/sanction.repository';

@Module({
  imports: [TypeOrmModule.forFeature([SanctionSchema, SanctionReportSchema])],
  providers: [
    {
      provide: SANCTION_REPOSITORY,
      useClass: OrmSanctionRepository,
    },
  ],
  exports: [SANCTION_REPOSITORY],
})
export class SanctionsModule {}
