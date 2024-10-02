import * as Joi from 'joi';

// validate .env file for all the required fields
export const envSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production')
    .default('development'),
  PORT: Joi.number().port().default(3000),

  PROJECT_NAME: Joi.string().required(),
  PROJECT_DESC: Joi.string().required(),
  PROJECT_VER: Joi.number().required(),

  GOOGLE_CLIENT_ID: Joi.string().required(),
  GOOGLE_CLIENT_SECRET: Joi.string().required(),
  GOOGLE_CALLBACK_URL: Joi.string().required(),
});
