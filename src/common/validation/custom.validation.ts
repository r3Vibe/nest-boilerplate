import Joi from 'joi';

export const phoneValidation = (phone: string, helpers: Joi.CustomHelpers) => {
  const indianPhoneRegex = /^[6-9]\d{9}$/;

  if (!indianPhoneRegex.test(phone)) {
    return helpers.message('error.phone' as any);
  }

  return phone;
};

export const objectId = (value: string, helpers: Joi.CustomHelpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message('error.id' as any);
  }
  return value;
};
