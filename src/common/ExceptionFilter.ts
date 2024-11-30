// import {
//   ArgumentsHost,
//   Catch,
//   ExceptionFilter,
//   HttpException,
// } from '@nestjs/common';
// import { I18nService } from 'nestjs-i18n';
// import { I18nTranslations } from 'src/i18n/i18n-types';

// @Catch(HttpException)
// export class GlobalExceptionFilter implements ExceptionFilter {
//   constructor(private readonly i18n: I18nService<I18nTranslations>) {}
//   catch(exception: HttpException, host: ArgumentsHost) {
//     const ctx = host.switchToHttp();
//     const response = ctx.getResponse();
//     const status = exception.getStatus();
//     const exceptionResponse = exception.getResponse();

//     if (
//       typeof exceptionResponse === 'object' &&
//       'metadata' in exceptionResponse
//     ) {
//       let message = '';

//       switch ((exceptionResponse.metadata as any).type) {
//         // when a field is required but not passed in the request
//         case 'required':
//           message = this.i18n.t('error.required', {
//             args: { label: (exceptionResponse.metadata as any).label },
//           });
//           break;

//         // when a field is not allowed in the request
//         case 'unknown':
//           message = this.i18n.t('error.unknown', {
//             args: { label: (exceptionResponse.metadata as any).label },
//           });
//           break;

//         // when a field is empty
//         case 'empty':
//           message = this.i18n.t('error.empty', {
//             args: { label: (exceptionResponse.metadata as any).label },
//           });
//           break;

//         // invalid email format
//         case 'email':
//           message = this.i18n.t('error.email', {
//             args: { label: (exceptionResponse.metadata as any).label },
//           });
//           break;

//         // custom validation error
//         case 'custom':
//           message = this.i18n.t((exceptionResponse.metadata as any).message, {
//             args: { label: (exceptionResponse.metadata as any).label },
//           });
//           break;

//         // invalid type (e.g., string, number, boolean)
//         case 'type':
//           message = this.i18n.t('error.type', {
//             args: { label: (exceptionResponse.metadata as any).label },
//           });
//           break;

//         // length constraints (min, max)
//         case 'length':
//           message = this.i18n.t('error.length', {
//             args: {
//               label: (exceptionResponse.metadata as any).label,
//               min: 0,
//               max: 0,
//             },
//           });
//           break;

//         // invalid enum or allowed value
//         case 'invalid':
//           message = this.i18n.t('error.invalid', {
//             args: { label: (exceptionResponse.metadata as any).label },
//           });
//           break;

//         // invalid pattern (regex)
//         case 'pattern':
//           message = this.i18n.t('error.pattern', {
//             args: { label: (exceptionResponse.metadata as any).label },
//           });
//           break;

//         // number or date out of range
//         case 'range':
//           message = this.i18n.t('error.range', {
//             args: { label: (exceptionResponse.metadata as any).label },
//           });
//           break;

//         // array contains duplicate elements
//         case 'unique':
//           message = this.i18n.t('error.unique', {
//             args: { label: (exceptionResponse.metadata as any).label },
//           });
//           break;
//       }

//       response.status(status).json({
//         success: false,
//         message,
//         timestamp: new Date().toISOString(),
//       });
//     }
//   }
// }

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
    const exceptionResponse: any = exception.getResponse();

    let message = '';

    console.log(exception, 'exception');

    if (exceptionResponse.type === 'Joi') {
      if (exceptionResponse.metadata.type === 'object.unknown') {
        message = this.i18n.t('error.unknown', {
          args: {
            label: ((exceptionResponse as any).metadata as any).label,
          },
        });
      } else if (exceptionResponse.metadata.type === 'string.min') {
        message = this.i18n.t(exceptionResponse.message, {
          args: {
            label: ((exceptionResponse as any).metadata as any).label,
            limit: ((exceptionResponse as any).metadata as any).context.limit,
          },
        });
      } else if (exceptionResponse.metadata.type === 'string.max') {
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
    }

    return response.status(status).json({
      success: false,
      message,
      timestamp: new Date().toISOString(),
    });
  }
}
