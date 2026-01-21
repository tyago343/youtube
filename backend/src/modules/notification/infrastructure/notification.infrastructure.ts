import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailSender } from '../application/ports/email-sender.interface';
import { TemplateRenderer } from '../application/ports/template-renderer.interface';
import { ResendEmailService } from './email/resend-email.service';
import { HandlebarsRendererService } from './templates/handlebars-renderer.service';

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
  ],
  exports: [EmailSender, TemplateRenderer],
})
export class NotificationInfrastructureModule {}
