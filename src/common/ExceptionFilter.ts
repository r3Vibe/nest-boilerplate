import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/i18n/i18n-types';

@Catch(HttpException)
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly i18n: I18nService<I18nTranslations>) {}
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    if (
      typeof exceptionResponse === 'object' &&
      'metadata' in exceptionResponse
    ) {
      switch ((exceptionResponse.metadata as any).type) {
        case 'required':
          response.status(status).json({
            success: false,
            message: this.i18n.t('error.required', {
              args: { label: (exceptionResponse.metadata as any).label },
            }),
            timestamp: new Date().toISOString(),
          });
          return;

        case 'unknown':
          response.status(status).json({
            success: false,
            message: this.i18n.t('error.unknown', {
              args: { label: (exceptionResponse.metadata as any).label },
            }),
            timestamp: new Date().toISOString(),
          });
          return;
        case 'empty':
          response.status(status).json({
            success: false,
            message: this.i18n.t('error.empty', {
              args: { label: (exceptionResponse.metadata as any).label },
            }),
            timestamp: new Date().toISOString(),
          });
          return;

        case 'email':
          response.status(status).json({
            success: false,
            message: this.i18n.t('error.email', {
              args: { label: (exceptionResponse.metadata as any).label },
            }),
            timestamp: new Date().toISOString(),
          });
          return;

        default:
          response.status(status).json({
            success: false,
            message: this.i18n.t('common.HELLO'),
            timestamp: new Date().toISOString(),
          });
          return;
      }
    }
  }
}
