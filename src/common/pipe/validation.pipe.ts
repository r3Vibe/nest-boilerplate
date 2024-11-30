// import {
//   BadRequestException,
//   Injectable,
//   PipeTransform,
//   ArgumentMetadata,
// } from '@nestjs/common';
// import * as Joi from 'joi';

// @Injectable()
// export class ValidationPipe<T> implements PipeTransform<T> {
//   constructor(
//     private schema: Joi.ObjectSchema,
//     private type: 'body' | 'params' | 'query',
//   ) {}

//   transform(value: T, metadata: ArgumentMetadata): T {
//     if (metadata.type !== this.type) {
//       return value;
//     }

//     const { error, value: validatedData } = this.schema.validate(value);

//     if (error) {
//       const firstError = error.details[0];

//       let label = '';
//       let type = '';
//       let message = '';

//       console.log(firstError);

//       switch (firstError.type) {
//         // when a field is required but not passed in the request
//         case 'any.required':
//           label = firstError.context.label;
//           type = 'required';
//           break;

//         // when a field is not allowed in the request
//         case 'object.unknown':
//           label = firstError.context.key;
//           type = 'unknown';
//           break;

//         // when a field is empty
//         case 'string.empty':
//         case 'any.empty': // Added any.empty case
//         case 'array.empty': // Added array.empty case
//           label = firstError.context.label;
//           type = 'empty';
//           break;

//         // invalid email
//         case 'string.email':
//           label = firstError.context.value;
//           type = 'email';
//           break;

//         // custom validation error
//         case 'custom':
//           message = firstError.message;
//           label = firstError.context.label;
//           type = 'custom';
//           break;

//         // invalid data type (e.g., string expected but a different type is provided)
//         case 'string.base':
//         case 'number.base':
//         case 'boolean.base':
//           label = firstError.context.label;
//           type = 'type';
//           break;

//         // invalid length (string, array, or number)
//         case 'string.min':
//         case 'string.max':
//         case 'array.min':
//         case 'array.max':
//           label = firstError.context.label;
//           type = 'length';
//           break;

//         // invalid value (enum or allowed value constraint)
//         case 'any.only':
//           label = firstError.context.label;
//           type = 'invalid';
//           break;

//         // invalid pattern (e.g., for strings)
//         case 'string.pattern.base':
//         case 'string.pattern.name':
//           label = firstError.context.label;
//           type = 'pattern';
//           break;

//         // number out of range (min, max) or date out of range
//         case 'number.min':
//         case 'number.max':
//         case 'date.min':
//         case 'date.max':
//           label = firstError.context.label;
//           type = 'range';
//           break;

//         // array contains duplicate elements
//         case 'array.unique':
//           label = firstError.context.label;
//           type = 'unique';
//           break;

//         // default case if the error type doesn't match
//         default:
//           label = firstError.context.label;
//           type = 'unknown_error';
//           break;
//       }

//       throw new BadRequestException({
//         metadata: { label, type, message },
//       });
//     }

//     return validatedData;
//   }
// }

import {
  BadRequestException,
  Injectable,
  PipeTransform,
  ArgumentMetadata,
} from '@nestjs/common';
import * as Joi from 'joi';

@Injectable()
export class ValidationPipe<T> implements PipeTransform<T> {
  constructor(
    private schema: Joi.ObjectSchema,
    private type: 'body' | 'params' | 'query',
  ) {}

  transform(value: T, metadata: ArgumentMetadata): T {
    if (metadata.type !== this.type) {
      return value;
    }

    const { error, value: validatedData } = this.schema.validate(value);

    if (error) {
      const formattedErrors = error.details.map((detail) =>
        detail.message.replace(/['"]/g, ''),
      );
      const errorMessage = formattedErrors.join(', ');
      throw new BadRequestException(errorMessage);
    }
    return validatedData;
  }
}
