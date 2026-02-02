import { Module } from '@nestjs/common';
import { ReportsApplicationModule } from '../application/reports.application';
import { ReportsController } from './http/reports.controller';
import { ReportsInfrastructureModule } from '../infrastructure/reports.infrestructure';
import { AuthenticationInfrastructureModule } from 'src/modules/authentication/infrastructure/authentication.infrastructure';

@Module({
  imports: [
    ReportsApplicationModule.withInfrastructure(ReportsInfrastructureModule),
    AuthenticationInfrastructureModule,
  ],
  controllers: [ReportsController],
})
export class ReportsPresentersModule {}
