import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import {
  EmailSender,
  EmailMessage,
} from '../../application/ports/email-sender.interface';
import { NotificationFailedException } from '../../domain';

@Injectable()
export class ResendEmailService extends EmailSender {
  private readonly client: Resend;
  private readonly fromAddress: string;

  constructor(private readonly configService: ConfigService) {
    super();
    const apiKey = this.configService.getOrThrow<string>('RESEND_API_KEY');
    this.fromAddress = this.configService.getOrThrow<string>('EMAIL_FROM');
    this.client = new Resend(apiKey);
  }

  async send(message: EmailMessage): Promise<void> {
    const { error } = await this.client.emails.send({
      from: this.fromAddress,
      to: message.to,
      subject: message.subject,
      html: message.html,
    });

    if (error) {
      throw new NotificationFailedException('email', message.to, error.message);
    }
  }
}
