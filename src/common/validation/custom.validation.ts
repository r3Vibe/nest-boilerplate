import Joi from 'joi';

export const phoneValidation = (phone: string, helpers: Joi.CustomHelpers) => {
  const indianPhoneRegex = /^[6-9]\d{9}$/;

  if (!indianPhoneRegex.test(phone)) {
    return helpers.message('Invalid phone number' as any);
  }

  return phone;
};
