import * as Joi from 'joi';
import { phoneValidation } from 'src/validation/custom.validation';

export const CreateUserValidation = Joi.object({
  first_name: Joi.string().required().label('First Name'),
  last_name: Joi.string().required().label('Last Name'),
  email: Joi.string().email().required().label('Email'),
  phone: Joi.string().required().custom(phoneValidation).label('Phone Number'),
});
