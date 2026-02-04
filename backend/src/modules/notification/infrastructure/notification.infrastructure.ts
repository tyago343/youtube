import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailSender } from '../application/ports/email-sender.interface';
import { TemplateRenderer } from '../application/ports/template-renderer.interface';
import { ResendEmailService } from './email/resend-email.service';
import { HandlebarsRendererService } from './templates/handlebars-renderer.service';
import { ReportsRepository } from 'src/modules/reports/application/ports/reports.repository';
import { OrmReportRepository } from 'src/modules/reports/infrastructure/persistence/typeorm/repositories/orm-report.repository';
import { ReportWatcherRepository } from 'src/modules/reports/application/ports/report-watcher.repository';
import { OrmReportWatcherRepository } from 'src/modules/reports/infrastructure/persistence/typeorm/repositories/orm-report-watcher.repository';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: EmailSender,
      useClass: ResendEmailService,
    },
    {
      provide: TemplateRenderer,
      useClass: HandlebarsRendererService,
    },
    {
      provide: ReportsRepository,
      useClass: OrmReportRepository,
    },
    {
      provide: ReportWatcherRepository,
      useClass: OrmReportWatcherRepository,
    },
  ],
  exports: [EmailSender, TemplateRenderer],
})
export class NotificationInfrastructureModule {}
