import { Inject, Injectable } from '@nestjs/common';
import {
  InjectPinoLogger,
  Logger,
  type Params,
  PARAMS_PROVIDER_TOKEN,
  PinoLogger,
} from 'nestjs-pino';

@Injectable()
export class LoggerService extends Logger {
  constructor(
    @InjectPinoLogger(LoggerService.name)
    readonly logger: PinoLogger,
    @Inject(PARAMS_PROVIDER_TOKEN) params: Params,
  ) {
    super(logger, params);
  }

  info(message: string, context?: string) {
    this.logger.info(message, context);
  }

  error(message: string, context?: string) {
    this.logger.error(message, context);
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, context);
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, context);
  }

  trace(message: string, context?: string) {
    this.logger.trace(message, context);
  }
}
