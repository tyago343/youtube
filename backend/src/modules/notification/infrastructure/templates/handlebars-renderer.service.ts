import { Injectable, OnModuleInit } from '@nestjs/common';
import * as Handlebars from 'handlebars';
import * as fs from 'node:fs';
import * as path from 'node:path';
import {
  TemplateRenderer,
  TemplateContext,
} from '../../application/ports/template-renderer.interface';

@Injectable()
export class HandlebarsRendererService
  extends TemplateRenderer
  implements OnModuleInit
{
  private readonly templates = new Map<string, Handlebars.TemplateDelegate>();
  private readonly templatesDir: string;

  constructor() {
    super();
    this.templatesDir = path.join(__dirname, 'emails');
  }

  onModuleInit(): void {
    this.loadTemplates();
  }

  private loadTemplates(): void {
    if (!fs.existsSync(this.templatesDir)) {
      return;
    }

    const files = fs.readdirSync(this.templatesDir);
    for (const file of files) {
      if (file.endsWith('.hbs')) {
        const templateName = file.replace('.hbs', '');
        const templatePath = path.join(this.templatesDir, file);
        const templateContent = fs.readFileSync(templatePath, 'utf8');
        this.templates.set(templateName, Handlebars.compile(templateContent));
      }
    }
  }

  render(templateName: string, context: TemplateContext): string {
    const template = this.templates.get(templateName);

    if (!template) {
      throw new Error(`Template "${templateName}" not found`);
    }

    return template(context);
  }
}
