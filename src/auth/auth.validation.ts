import * as Joi from 'joi';
import { enhanceSchemaWithMessages } from 'src/common/joi.i18n';

export const CreateUserValidation = enhanceSchemaWithMessages(
  Joi.object({
    isEnabled: Joi.boolean().required().label('isEnabled'),

    mustBeTrue: Joi.boolean().required().valid(true).label('mustBeTrue'),

    mustBeFalse: Joi.boolean().required().valid(false).label('mustBeFalse'),
    tt: Joi.string().required().label('tt').valid('tt', 'ttt'),
    ttnum: Joi.number().required().label('ttnum').valid(5, 10),

    uri: Joi.string().uri().required().label('uri'),
    email: Joi.string().email().required().label('email'),

    x: Joi.number().min(0).max(10).required().label('x'),

    my: Joi.array()
      .min(2)
      .max(10)
      .required()
      .items(
        Joi.object({
          y: Joi.string().uri().required().label('y'),
        }),
      )
      .label('my'),
  }),
);
