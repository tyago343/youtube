import { Injectable } from '@nestjs/common';
import { EmailSender } from '../ports/email-sender.interface';
import { TemplateRenderer } from '../ports/template-renderer.interface';

interface SendWelcomeEmailInput {
  readonly email: string;
  readonly username: string;
}

@Injectable()
export class SendWelcomeEmailUseCase {
  private static readonly TEMPLATE_NAME = 'welcome';
  private static readonly EMAIL_SUBJECT = 'Welcome to our platform!';

  constructor(
    private readonly emailSender: EmailSender,
    private readonly templateRenderer: TemplateRenderer,
  ) {}

  async execute(input: SendWelcomeEmailInput): Promise<void> {
    const html = this.templateRenderer.render(
      SendWelcomeEmailUseCase.TEMPLATE_NAME,
      {
        username: input.username,
      },
    );

    await this.emailSender.send({
      to: input.email,
      subject: SendWelcomeEmailUseCase.EMAIL_SUBJECT,
      html,
    });
  }
}
