import * as Joi from 'joi';
import {
  objectId,
  phoneValidation,
} from 'src/common/validation/custom.validation';

export const CreateUserEmailPassValidation = Joi.object({
  first_name: Joi.string().allow('').required().label('First Name'),
  last_name: Joi.string().optional().allow('').label('Last Name'),
  email: Joi.string().email().required().label('Email'),
  phone: Joi.string()
    .required()
    .allow('')
    .label('Phone')
    .custom(phoneValidation),
  password: Joi.string().required().label('Password'),
  id: Joi.string().required().custom(objectId),
  my: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().required().custom(objectId),
      }),
    )
    .required()
    .min(2)
    .max(5),
});
