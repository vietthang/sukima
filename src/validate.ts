import { Schema } from './schemas/base';
import { JsonSchema } from './jsonSchema';
import Ajv = require('ajv');

export interface ValidateOptions {
  convert: boolean;
}

export async function validate<T>(schema: Schema<T>, value: any, options?: ValidateOptions): Promise<T>;

export async function validate(schema: JsonSchema, value: any, options?: ValidateOptions): Promise<any>;

export async function validate(schema: any, value: any, options: ValidateOptions = { convert: false }): Promise<any> {
  const ajv = new Ajv({
    useDefaults: true,
    coerceTypes: options.convert ? 'array' : false,
  });

  let clonedValue: any;
  if (typeof value === 'object' && value !== null) {
    clonedValue = JSON.parse(JSON.stringify(value));
  } else {
    clonedValue = value;
  }
  const jsonSchema = schema instanceof Schema ? schema.getJsonSchema() : schema;
  const validate = ajv.compile({
    ...jsonSchema,
    $async: true,
  });
  const result = await validate(clonedValue);
  if (!result) {
    throw new Error('Unknown error');
  } else {
    return clonedValue;
  }
}
