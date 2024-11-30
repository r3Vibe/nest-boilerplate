import * as Joi from 'joi';

const CreateUserEmailPassValidation = Joi.object({
  first_name: Joi.string().required().label('First Name'),
  last_name: Joi.string().required().label('Last Name'),
  email: Joi.string().email().required().label('Email'),
  password: Joi.string().required().label('Password').min(8).max(32),
  phone: Joi.string()
    .required()
    .label('Phone')
    .regex(/^[6-9]\d{9}$/),
});

function enhanceSchemaWithMessages(schema: any) {
  const enhancedSchema = Object.keys(schema.describe().keys).reduce(
    (acc: any, key: string) => {
      const fieldSchema = schema.extract(key);
      const fieldSchemaDescribe = fieldSchema.describe();

      const errorMsgs: any = {
        'string.base': 'error.invalid',
      };

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
