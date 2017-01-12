import memoize = require('lodash/memoize');
import cloneDeep = require('lodash/cloneDeep');
import Ajv = require('ajv');

import { Schema } from './schemas/base';
import { JsonSchema } from './jsonSchema';

export interface ValidateOptions {
  convert: boolean;
}

class ValidationError extends Error {

  public readonly errors: Ajv.ErrorObject[];

  public readonly source: any;

  constructor(source: any, errors: Ajv.ErrorObject[]) {
    super('Validation Error');
    this.source = source;
    this.errors = errors.filter(error => error.keyword !== '__type');
  }

}

class UnknownError extends Error {

  constructor() {
    super('Unknown Error');
  }

}

const getAjvInstance = memoize((convert: boolean) => {
  const ajv = new Ajv({
    useDefaults: true,
    coerceTypes: convert ? 'array' : false,
  });

  ajv.addKeyword(
    '__type',
    {
      macro(schema: any, parentSchema: any): any {
        if (parentSchema['x-nullable']) {
          return {
            type: ['null', schema],
          };
        } else {
          return {
            type: schema,
          };
        }
      }
    }
  )

  return ajv;
})

export function validate<T>(schema: Schema<T>, value: any, options?: ValidateOptions): T;

export function validate(schema: JsonSchema, value: any, options?: ValidateOptions): any;

export function validate(schema: any, value: any, options: ValidateOptions = { convert: false }): any {
  const ajv = getAjvInstance(options.convert);

  const clonedValue = cloneDeep(value);
  const jsonSchema = schema instanceof Schema ? schema.schema : schema;
  const compiled = ajv.compile(jsonSchema);
  const result = compiled(clonedValue);
  if (!result) {
    if (compiled.errors) {
      throw new ValidationError(clonedValue, compiled.errors)
    } else {
      throw new UnknownError();
    }
  } else {
    return clonedValue;
  }
}

export function validateAsync<T>(schema: Schema<T>, value: any, options?: ValidateOptions): Promise<T>;

export function validateAsync(schema: JsonSchema, value: any, options?: ValidateOptions): Promise<any>;

export function validateAsync(schema: any, value: any, options: ValidateOptions = { convert: false }): Promise<any> {
  const ajv = getAjvInstance(options.convert);

  const clonedValue = cloneDeep(value);
  const jsonSchema = schema instanceof Schema ? schema.schema : schema;
  const compiled = ajv.compile({
    ...jsonSchema,
    $async: true,
  });
  try {
    const result = compiled(clonedValue);
    if (!result) {
      throw new UnknownError();
    }
    return clonedValue;
  } catch (error) {
    if (error.ajv) {
      throw new ValidationError(clonedValue, error.errors);
    } else {
      throw error;
    }
  }
}
