import * as Joi from 'joi';

export const CreateUserEmailPassValidation = Joi.object({
  first_name: Joi.string().optional().allow('').label('First Name'),
  last_name: Joi.string().optional().allow('').label('Last Name'),
  email: Joi.string().email().required().label('Email'),
  phone: Joi.string().optional().allow('').label('Phone'),
  password: Joi.string().required().label('Password'),
});
