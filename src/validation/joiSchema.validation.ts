import { UsePipes, applyDecorators } from '@nestjs/common';
import * as Joi from 'joi';
import { ValidationPipe } from 'src/pipe/validation.pipe';

export function JoiSchema(
  schema: Joi.ObjectSchema,
  type: 'body' | 'params' | 'query',
) {
  return applyDecorators(UsePipes(new ValidationPipe(schema, type)));
}
