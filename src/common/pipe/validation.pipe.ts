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
      const firstError = error.details[0];

      console.log(firstError);

      switch (firstError.type) {
        case 'any.required':
          throw new BadRequestException({
            metadata: {
              label: firstError.context.label,
              type: 'required',
            },
          });
        case 'object.unknown':
          throw new BadRequestException({
            metadata: {
              label: firstError.context.key,
              type: 'unknown',
            },
          });

        case 'string.empty':
          throw new BadRequestException({
            metadata: {
              label: firstError.context.label,
              type: 'empty',
            },
          });

        case 'string.email':
          throw new BadRequestException({
            metadata: {
              label: firstError.context.value,
              type: 'email',
            },
          });
      }
    }

    return validatedData;
  }
}
