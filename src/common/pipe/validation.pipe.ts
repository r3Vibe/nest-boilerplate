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
