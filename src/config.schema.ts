import * as Joi from '@hapi/joi';

export const configValidationSchema = Joi.object({
  STAGE: Joi.string().required(),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required().default(5432),
  DB_DATABASE: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
});
