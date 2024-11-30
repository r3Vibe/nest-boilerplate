import * as Joi from 'joi';
import { i18nValidationMessage } from 'nestjs-i18n';

export const CreateUserEmailPassValidation = Joi.object({
  first_name: Joi.string()
    .allow('')
    .required()
    .label('First Name')
    .messages({
      'string.empty': i18nValidationMessage('error.empty') as any,
    }),
});
