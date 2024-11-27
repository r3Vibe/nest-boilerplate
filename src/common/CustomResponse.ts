import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { I18nTranslations } from 'src/i18n/i18n-types';

@Injectable()
export class TransformResponseInterceptor implements NestInterceptor {
  constructor(private readonly i18n: I18nService<I18nTranslations>) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        let endData = { ...data };
        delete endData.message;
        Object.keys(endData).forEach((key) => {
          if (typeof endData[key] === 'object') {
            endData = { ...endData[key] };
          }
        });
        return {
          success: true,
          data: endData,
          message: this.i18n.t(data.message),
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}