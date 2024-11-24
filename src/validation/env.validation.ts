import * as Joi from 'joi';

// validate .env file for all the required fields
export const envSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'staging')
    .required(),
  PORT: Joi.number().port().default(3000),

  PROJECT_NAME: Joi.string().required(),
  PROJECT_DESC: Joi.string().required(),
  PROJECT_VER: Joi.string().required(),

  GOOGLE_CLIENT_ID: Joi.string().optional(),
  GOOGLE_CLIENT_SECRET: Joi.string().optional(),
  GOOGLE_CALLBACK_URL: Joi.string().optional(),

  JWT_SECRET: Joi.string().required(),
  JWT_ISS: Joi.string().required(),
  JWT_ACCESS_EXPIRY_HOURS: Joi.string().required(),
  JWT_REFRESH_EXPIRY_DAYS: Joi.string().required(),
  JWT_ALGO: Joi.string().valid('HS256', 'HS512').required(),

  FALLBACK_LANGUAGE: Joi.string().required(),

  MONGODB_URI: Joi.string().required(),

  VERIFY_EMAIL_AFTER_REGISTRATION: Joi.boolean().required(),
  NEED_OTP_AFTER_LOGIN: Joi.boolean().required(),

  VERIFICATION_OTP_EXPIRY_MINUTES: Joi.number().optional(),

  OTP_DELIVERY: Joi.string()
    .valid('email', 'phone', 'both')
    .optional()
    .default('email'),
});
