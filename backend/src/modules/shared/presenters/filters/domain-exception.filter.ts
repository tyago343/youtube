import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

// Channel domain exceptions
import { ChannelNotFoundException } from 'src/modules/channels/domain/exceptions/channel-not-found.exception';
import { InvalidChannelIdException } from 'src/modules/channels/domain/exceptions/invalid-channel-id.exception';
import { InvalidChannelNameException } from 'src/modules/channels/domain/exceptions/invalid-channel-name.exception';
import { InvalidChannelStatusException } from 'src/modules/channels/domain/exceptions/invalid-channel-status.exception';
import { InvalidInfractionSeverityException } from 'src/modules/channels/domain/exceptions/invalid-infraction-severity.exception';

// Video domain exceptions
import { VideoNotFoundException } from 'src/modules/videos/domain/exceptions/video-not-found.exception';
import { InvalidVideoIdException } from 'src/modules/videos/domain/exceptions/invalid-video-id.exception';
import { InvalidVideoVisibilityException } from 'src/modules/videos/domain/exceptions/invalid-video-visibility.exception';

// Report domain exceptions
import { ReportNotFoundException } from 'src/modules/reports/domain/exceptions/report-not-found.exception';

// User domain exceptions
import { UserNotFoundException } from 'src/modules/users/domain/exceptions/user-not-found.exception';
import { UserAlreadyExistsException } from 'src/modules/users/domain/exceptions/user-already-exists.exceptions';
import { InvalidUserIdException } from 'src/modules/users/domain/exceptions/invalid-user-id.exception';
import { InvalidUsernameException } from 'src/modules/users/domain/exceptions/invalid-username.exception';
import { InvalidPasswordException } from 'src/modules/users/domain/exceptions/invalid-password.exception';
import { InvalidEmailException } from 'src/modules/users/domain/exceptions/invalid-email.exception';
import { InvalidAvatarUrlException } from 'src/modules/users/domain/exceptions/invalid-avatar-url.exception';

// Authentication domain exceptions
import { InvalidCredentialsException } from 'src/modules/authentication/domain/exceptions/invalid-crendetials.exception';
import { TokenExpiredException } from 'src/modules/authentication/domain/exceptions/token-expired.exception';

type ErrorConstructor = new (...args: unknown[]) => Error;

const NOT_FOUND_EXCEPTIONS: ErrorConstructor[] = [
  ChannelNotFoundException,
  VideoNotFoundException,
  UserNotFoundException,
  ReportNotFoundException,
];

const BAD_REQUEST_EXCEPTIONS: ErrorConstructor[] = [
  InvalidChannelIdException,
  InvalidChannelNameException,
  InvalidChannelStatusException,
  InvalidInfractionSeverityException,
  InvalidVideoIdException,
  InvalidVideoVisibilityException,
  InvalidUserIdException,
  InvalidUsernameException,
  InvalidPasswordException,
  InvalidEmailException,
  InvalidAvatarUrlException,
];

const CONFLICT_EXCEPTIONS: ErrorConstructor[] = [UserAlreadyExistsException];

const UNAUTHORIZED_EXCEPTIONS: ErrorConstructor[] = [
  InvalidCredentialsException,
  TokenExpiredException,
];

interface ErrorResponse {
  statusCode: number;
  message: string;
  error: string;
}

@Catch()
export class DomainExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(DomainExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // If it's already an HttpException from NestJS, let it pass through
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      response.status(status).json(exceptionResponse);
      return;
    }

    // Translate domain exceptions to HTTP responses
    if (this.isInstanceOfAny(exception, NOT_FOUND_EXCEPTIONS)) {
      this.sendResponse(response, HttpStatus.NOT_FOUND, exception, 'Not Found');
      return;
    }

    if (this.isInstanceOfAny(exception, BAD_REQUEST_EXCEPTIONS)) {
      this.sendResponse(
        response,
        HttpStatus.BAD_REQUEST,
        exception,
        'Bad Request',
      );
      return;
    }

    if (this.isInstanceOfAny(exception, CONFLICT_EXCEPTIONS)) {
      this.sendResponse(response, HttpStatus.CONFLICT, exception, 'Conflict');
      return;
    }

    if (this.isInstanceOfAny(exception, UNAUTHORIZED_EXCEPTIONS)) {
      this.sendResponse(
        response,
        HttpStatus.UNAUTHORIZED,
        exception,
        'Unauthorized',
      );
      return;
    }

    // Unhandled exception → 500
    this.logger.error('Unhandled exception:', exception);
    const errorResponse: ErrorResponse = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
      error: 'Internal Server Error',
    };
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse);
  }

  private isInstanceOfAny(
    exception: unknown,
    types: ErrorConstructor[],
  ): boolean {
    return types.some((type) => exception instanceof type);
  }

  // eslint-disable-next-line max-params
  private sendResponse(
    response: Response,
    status: HttpStatus,
    exception: unknown,
    error: string,
  ): void {
    const errorResponse: ErrorResponse = {
      statusCode: status,
      message: (exception as Error).message,
      error,
    };
    response.status(status).json(errorResponse);
  }
}
