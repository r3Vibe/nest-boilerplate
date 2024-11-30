import * as Joi from 'joi';

const CreateUserEmailPassValidation = Joi.object({
  optionalNumber: Joi.number().optional().allow(null).label('optionalNumber'),
});

function enhanceSchemaWithMessages(schema: any) {
  const enhancedSchema = Object.keys(schema.describe().keys).reduce(
    (acc: any, key: string) => {
      const fieldSchema = schema.extract(key);
      const fieldSchemaDescribe = fieldSchema.describe();

      const errorMsgs: any = {};

      // handle strings
      if (fieldSchemaDescribe.type === 'string') {
        errorMsgs['string.base'] = 'error.base';
        if (fieldSchemaDescribe.flags.presence === 'required') {
          errorMsgs['any.required'] = 'error.required';
        }

        if (fieldSchemaDescribe.flags.only) {
          errorMsgs['any.only'] = 'error.only';
        }

        if (!fieldSchemaDescribe.allow) {
          errorMsgs['string.empty'] = 'error.empty';
        }

        if (fieldSchemaDescribe.rules && fieldSchemaDescribe.rules.length > 0) {
          fieldSchemaDescribe.rules.forEach((rule: any) => {
            if (rule.name === 'min') {
              errorMsgs['string.min'] = 'error.min';
            }

            if (rule.name === 'max') {
              errorMsgs['string.max'] = 'error.max';
            }

            if (rule.name === 'pattern') {
              errorMsgs['string.pattern.base'] = 'error.pattern';
            }

            if (rule.name === 'email') {
              errorMsgs['string.email'] = 'error.email';
            }

            if (rule.name === 'uri') {
              errorMsgs['string.uri'] = 'error.uri';
            }

            if (rule.name === 'length') {
              errorMsgs['string.length'] = 'error.length';
            }
          });
        }
      }

      // handle numbers
      if (fieldSchemaDescribe.type === 'number') {
        errorMsgs['number.base'] = 'error.number.base';

        if (fieldSchemaDescribe.flags.presence === 'required') {
          errorMsgs['any.required'] = 'error.required';
        }

        if (fieldSchemaDescribe.rules && fieldSchemaDescribe.rules.length > 0) {
          fieldSchemaDescribe.rules.forEach((rule: any) => {
            if (rule.name === 'min') {
              errorMsgs['number.min'] = 'error.number.min';
            }

            if (rule.name === 'max') {
              errorMsgs['number.max'] = 'error.number.max';
            }

            if (rule.name === 'pattern') {
              errorMsgs['number.pattern.base'] = 'error.pattern';
            }

            if (rule.name === 'sign' && rule.args.sign === 'positive') {
              errorMsgs['number.sign'] = 'error.sign.positive';
            }

            if (rule.name === 'sign' && rule.args.sign === 'negative') {
              errorMsgs['number.sign'] = 'error.sign.negative';
            }

            if (rule.name === 'greater') {
              errorMsgs['number.greater'] = 'error.greater';
            }

            if (rule.name === 'less') {
              errorMsgs['number.less'] = 'error.less';
            }
          });
        }
      }

      // Enhance the schema with custom messages
      const enhancedFieldSchema = fieldSchema.messages(errorMsgs as any);

      acc[key] = enhancedFieldSchema;

      return acc;
    },
    {},
  );

  return Joi.object(enhancedSchema);
}

export const CreateUserValidation = enhanceSchemaWithMessages(
  CreateUserEmailPassValidation,
);
