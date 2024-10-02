import * as Joi from 'joi';

// validate .env file for all the required fields
export const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production').required(),
  PORT: Joi.number().port().default(3000),

  PROJECT_NAME: Joi.string().required(),
  PROJECT_DESC: Joi.string().required(),
  PROJECT_VER: Joi.number().required(),

  GOOGLE_CLIENT_ID: Joi.string().required(),
  GOOGLE_CLIENT_SECRET: Joi.string().required(),
  GOOGLE_CALLBACK_URL: Joi.string().required(),

  JWT_SECRET: Joi.string().required(),
  JWT_ISS: Joi.string().required(),
  JWT_ACCESS_EXPIRY_HOURS: Joi.string().required(),
  JWT_REFRESH_EXPIRY_DAYS: Joi.string().required(),
  JWT_ALGO: Joi.string().valid('HS256', 'HS512').required(),
});
