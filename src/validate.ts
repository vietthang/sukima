import { Schema } from './schemas/base';
import { JsonSchema } from './jsonSchema'
import Ajv = require('ajv');

const ajv = new Ajv({
  useDefaults: true,
  coerceTypes: 'array',
});

export async function validate<T>(schema: Schema<T>, value: any): Promise<T>;

export async function validate(schema: JsonSchema, value: any): Promise<any>;

export async function validate(schema: any, value: any): Promise<any> {
  const clonedAttributes = JSON.parse(JSON.stringify(value)); // deep clone
  const jsonSchema = schema instanceof Schema ? schema.getJsonSchema() : schema;
  const validate = ajv.compile({
    ...jsonSchema,
    $async: true,
  });
  const result = await validate(clonedAttributes);
  if (!result) {
    throw new Error('Unknown error');
  } else {
    return clonedAttributes;
  }
}
