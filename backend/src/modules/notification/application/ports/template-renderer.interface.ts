export interface TemplateContext {
  readonly [key: string]: unknown;
}

export abstract class TemplateRenderer {
  abstract render(templateName: string, context: TemplateContext): string;
}
