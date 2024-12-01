import * as Joi from 'joi';

/**
 *
 * @author Arnab Gupta
 * @description Wrape your joi schema with this function. It will analyze the schema and add custom messages that will get translated by nest-i18n. Currently support string, number and date
 * @param schema
 * @returns Joi Schema
 */
export function enhanceSchemaWithMessages(schema: any) {
  const enhancedSchema = Object.keys(schema.describe().keys).reduce(
    (acc: any, key: string) => {
      const fieldSchema = schema.extract(key);
      const fieldSchemaDescribe = fieldSchema.describe();

      const errorMsgs: any = {};

      // handle strings
      if (fieldSchemaDescribe.type === 'string') {
        errorMsgs['string.base'] = 'error.string.base';

        if (fieldSchemaDescribe.flags.presence === 'required') {
          errorMsgs['any.required'] = 'error.required';
        }

        if (fieldSchemaDescribe.flags.only) {
          errorMsgs['any.only'] = 'error.only';
        }

        if (!fieldSchemaDescribe.allow) {
          errorMsgs['string.empty'] = 'error.string.empty';
        }

        if (fieldSchemaDescribe.rules && fieldSchemaDescribe.rules.length > 0) {
          fieldSchemaDescribe.rules.forEach((rule: any) => {
            if (rule.name === 'min') {
              errorMsgs['string.min'] = 'error.string.min';
            }

            if (rule.name === 'max') {
              errorMsgs['string.max'] = 'error.string.max';
            }

            if (rule.name === 'pattern') {
              errorMsgs['string.pattern.base'] = 'error.string.pattern';
            }

            if (rule.name === 'email') {
              errorMsgs['string.email'] = 'error.string.email';
            }

            if (rule.name === 'uri') {
              errorMsgs['string.uri'] = 'error.string.uri';
            }

            if (rule.name === 'length') {
              errorMsgs['string.length'] = 'error.string.length';
            }
          });
        }
      }

      // handle numbers
      if (fieldSchemaDescribe.type === 'number') {
        errorMsgs['number.base'] = 'error.number.base';

        if (fieldSchemaDescribe.flags.only) {
          errorMsgs['any.only'] = 'error.only';
        }

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
              errorMsgs['number.pattern.base'] = 'error.number.pattern';
            }

            if (rule.name === 'sign' && rule.args.sign === 'positive') {
              errorMsgs['number.sign'] = 'error.number.sign.positive';
            }

            if (rule.name === 'sign' && rule.args.sign === 'negative') {
              errorMsgs['number.sign'] = 'error.number.sign.negative';
            }

            if (rule.name === 'greater') {
              errorMsgs['number.greater'] = 'error.number.greater';
            }

            if (rule.name === 'less') {
              errorMsgs['number.less'] = 'error.number.less';
            }
          });
        }
      }

      // handle dates
      if (fieldSchemaDescribe.type === 'date') {
        errorMsgs['date.base'] = 'error.date.base';

        if (fieldSchemaDescribe.flags.presence === 'required') {
          errorMsgs['any.required'] = 'error.required';
        }

        if (fieldSchemaDescribe.flags.format === 'iso') {
          errorMsgs['date.format'] = 'error.date.iso';
        }

        if (fieldSchemaDescribe.flags.format === 'javascript') {
          errorMsgs['date.format'] = 'error.date.javascript';
        }

        if (fieldSchemaDescribe.rules && fieldSchemaDescribe.rules.length > 0) {
          fieldSchemaDescribe.rules.forEach((rule: any) => {
            if (rule.name === 'min') {
              errorMsgs['date.min'] = 'error.date.min';
            }

            if (rule.name === 'max') {
              errorMsgs['date.max'] = 'error.date.max';
            }

            if (rule.name === 'greater') {
              errorMsgs['date.greater'] = 'error.date.greater';
            }

            if (rule.name === 'less') {
              errorMsgs['date.less'] = 'error.date.less';
            }
          });
        }
      }

      // handle booleans
      if (fieldSchemaDescribe.type === 'boolean') {
        errorMsgs['boolean.base'] = 'error.boolean.base';

        if (fieldSchemaDescribe.flags.presence === 'required') {
          errorMsgs['any.required'] = 'error.required';
        }

        if (fieldSchemaDescribe.flags.only && fieldSchemaDescribe.allow[0]) {
          errorMsgs['any.only'] = 'error.only';
        }

        if (fieldSchemaDescribe.flags.only && !fieldSchemaDescribe.allow[0]) {
          errorMsgs['any.only'] = 'error.only';
        }
      }

      // handle arrays
      if (fieldSchemaDescribe.type === 'array') {
        // handle objects
        if (fieldSchemaDescribe.items) {
          errorMsgs['object.base'] = 'error.object.base';

          if (fieldSchemaDescribe.flags.presence === 'required') {
            errorMsgs['any.required'] = 'error.required';
          }
        }
        errorMsgs['array.includesRequiredUnknowns'] = 'error.array.unknown';

        errorMsgs['array.base'] = 'error.array.base';

        if (fieldSchemaDescribe.flags.presence === 'required') {
          errorMsgs['any.required'] = 'error.required';
        }

        if (fieldSchemaDescribe.rules && fieldSchemaDescribe.rules.length > 0) {
          fieldSchemaDescribe.rules.forEach((rule: any) => {
            if (rule.name === 'min') {
              errorMsgs['array.min'] = 'error.array.min';
            }

            if (rule.name === 'max') {
              errorMsgs['array.max'] = 'error.array.max';
            }

            if (rule.name === 'length') {
              errorMsgs['array.length'] = 'error.array.length';
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
