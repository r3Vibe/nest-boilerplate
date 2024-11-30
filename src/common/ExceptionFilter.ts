import {
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { CustomLoggerService } from './custom-logger/custom-logger.service';
import { I18nTranslations } from 'src/i18n/i18n-types';
import { I18nService } from 'nestjs-i18n';
import { MongoServerError } from 'mongodb';

@Catch()
export class AllExceptionFilter extends BaseExceptionFilter {
  private readonly logger = new CustomLoggerService();

  constructor(private readonly i18n: I18nService<I18nTranslations>) {
    super();
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let message = this.i18n.t('error.generic');
    let status = HttpStatus.INTERNAL_SERVER_ERROR;

    // http exception handling
    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse() as any;
      status = exception.getStatus();

      if (exceptionResponse.type === 'Joi') {
        // joi validation error
        status = HttpStatus.BAD_REQUEST;

        console.log(exceptionResponse);

        if (exceptionResponse.metadata.type === 'object.unknown') {
          message = this.i18n.t('error.unknown', {
            args: {
              label: ((exceptionResponse as any).metadata as any).label,
            },
          });
        } else if (
          exceptionResponse.metadata.type === 'string.min' ||
          exceptionResponse.metadata.type === 'string.max'
        ) {
          message = this.i18n.t(exceptionResponse.message, {
            args: {
              label: ((exceptionResponse as any).metadata as any).label,
              limit: ((exceptionResponse as any).metadata as any).context.limit,
            },
          });
        } else if (exceptionResponse.metadata.type === 'any.only') {
          message = this.i18n.t(exceptionResponse.message, {
            args: {
              label: exceptionResponse.metadata.context.valids.join(','),
            },
          });
        } else if (
          exceptionResponse.metadata.type === 'number.min' ||
          exceptionResponse.metadata.type === 'number.max'
        ) {
          message = this.i18n.t(exceptionResponse.message, {
            args: {
              label: ((exceptionResponse as any).metadata as any).label,
              limit: ((exceptionResponse as any).metadata as any).context.limit,
            },
          });
        } else if (
          exceptionResponse.metadata.type === 'number.greater' ||
          exceptionResponse.metadata.type === 'number.less'
        ) {
          message = this.i18n.t(exceptionResponse.message, {
            args: {
              label: ((exceptionResponse as any).metadata as any).label,
              limit: ((exceptionResponse as any).metadata as any).context.limit,
            },
          });
        } else {
          message = this.i18n.t(exceptionResponse.message, {
            args: {
              label: ((exceptionResponse as any).metadata as any).label,
            },
          });
        }
      } else if (exception.getStatus() === HttpStatus.TOO_MANY_REQUESTS) {
        // too many requests error
        message = this.i18n.t('error.tooManyRequests');
        status = HttpStatus.TOO_MANY_REQUESTS;
      } else if (exception instanceof UnauthorizedException) {
        message = this.i18n.t('error.unauthorized');
        status = HttpStatus.UNAUTHORIZED;
      } else if (exception instanceof ForbiddenException) {
        message = this.i18n.t('error.invalid');
        status = HttpStatus.UNAUTHORIZED;
      } else if (exception instanceof NotFoundException) {
        message = this.i18n.t('error.notFound');
        status = HttpStatus.NOT_FOUND;
      } else if (exception instanceof ConflictException) {
        message = this.i18n.t('error.conflict');
        status = HttpStatus.CONFLICT;
      } else {
        // other http error
        message = this.i18n.t('error.generic');
        status = HttpStatus.INTERNAL_SERVER_ERROR;
      }
    }

    // mongodb error handling duplicate key
    if (exception instanceof MongoServerError && exception.code === 11000) {
      const errMsg = exception.errorResponse.message.split(':');
      const uniqueValue = errMsg[errMsg.length - 1]
        .replace(/['"]/g, '')
        .replace(/\s/g, '')
        .replace('}', '');

      message = this.i18n.t('error.unique', {
        args: {
          label: uniqueValue,
        },
      });
      status = HttpStatus.CONFLICT;
    }

    // other database error
    if (exception instanceof MongoServerError && exception.code !== 11000) {
      message = this.i18n.t('error.database_issue');
      status = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    this.logger.error(message, 'AllExceptionFilter');

    return response.status(status).json({
      success: false,
      message,
      timestamp: new Date().toISOString(),
    });
  }
}
