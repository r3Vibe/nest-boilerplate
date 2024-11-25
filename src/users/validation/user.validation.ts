import * as Joi from 'joi';
import { phoneValidation } from 'src/common/validation/custom.validation';

export const CreateUserValidation = Joi.object({
  first_name: Joi.string().required().label('First Name').messages({
    'string.empty': 'test.Hola',
    'any.required': 'test.Hijibit',
  }),
  last_name: Joi.string().required().label('Last Name'),
  email: Joi.string().email().required().label('Email'),
  password: Joi.string().required().label('Password'),
  phone: Joi.string().required().custom(phoneValidation).label('Phone Number'),
});
