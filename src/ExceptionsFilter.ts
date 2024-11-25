import {
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';
import { CustomLoggerService } from './common/custom-logger/custom-logger.service';
import { I18nContext, I18nTranslation } from 'nestjs-i18n';

type ResponseObj = {
  statusCode: number;
  timestamp: string;
  path: string;
  response: string | object;
};

@Catch()
export class AllExceptionFilter extends BaseExceptionFilter {
  private readonly logger = new CustomLoggerService();

  catch(exception: unknown, host: ArgumentsHost): void {
    const i18n = I18nContext.current<I18nTranslation>(host);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const ResponseObj: ResponseObj = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      timestamp: new Date().toISOString(),
      path: request.url,
      response: '',
    };

    if (exception instanceof HttpException) {
      ResponseObj.statusCode = exception.getStatus();
      if (exception.getStatus() === 500) {
        ResponseObj.response = i18n.translate('error.unknown' as never, {
          lang: i18n.lang,
        });
      } else {
        ResponseObj.response = i18n.translate(exception.message as never, {
          lang: i18n.lang,
        });
      }
    } else if (exception instanceof Error) {
      if ('code' in exception && exception.code === 11000) {
        const duplicateKeyMessage = (exception as any).message;
        const match = duplicateKeyMessage.match(
          /index: (\w+).*dup key: \{ (.+?): "(.+?)" \}/,
        );

        const field = match[2];
        const value = match[3];

        ResponseObj.statusCode = HttpStatus.CONFLICT;
        ResponseObj.response = i18n.t('error.duplicate' as never, {
          lang: i18n.lang,
          args: { field, value },
        });
      } else {
        ResponseObj.statusCode = HttpStatus.UNPROCESSABLE_ENTITY;
        ResponseObj.response = exception.message.replaceAll(/\n/g, ' ');
      }
    } else {
      ResponseObj.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      ResponseObj.response = i18n.translate('error.unknown' as never, {
        lang: i18n.lang,
      });
    }

    response.status(ResponseObj.statusCode).json(ResponseObj);
    this.logger.error(ResponseObj.response, AllExceptionFilter.name);

    // super.catch(exception, host);
  }
}
