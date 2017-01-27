import cloneDeep = require('lodash/cloneDeep');
import mapValues = require('lodash/mapValues');
import Ajv = require('ajv');

import { Schema } from './schemas/base';
import { JsonSchema } from './jsonSchema';
import { evictUndefined, memoize } from './utils';

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

type AjvContainer = {
  compile: (schema: Object) => Ajv.ValidateFunction;
}

const getAjvInstance = memoize<boolean, AjvContainer>(
  (convert: boolean) => {
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
    );

    return {
      compile: memoize<any, Ajv.ValidateFunction>(
        (schema: Object) => ajv.compile(schema),
      ),
    }
  },
);

const toAjvSchema = memoize(
  (schema: any): any => {
    if (schema instanceof Schema) {
      const jsonSchema = schema.toJsonSchema();
      const { properties, items } = jsonSchema;

      return evictUndefined({
        ...jsonSchema,
        type: undefined,
        __type: schema.props.type,
        nullable: undefined,
        properties: properties ? mapValues(properties, (childSchema: Schema<any>) => {
          return toAjvSchema(childSchema);
        }) : undefined,
        items: items ? toAjvSchema(items) : undefined,
      });
    } else {
      return schema;
    }
  },
);

export function validate<T>(schema: Schema<T>, value: any, options?: ValidateOptions): T;

/** @internal */
export function validate(schema: JsonSchema, value: any, options?: ValidateOptions): any;

export function validate(schema: any, value: any, options: ValidateOptions = { convert: false }): any {
  const ajv = getAjvInstance(options.convert);
  const clonedValue = cloneDeep(value);
  const compiled = ajv.compile(toAjvSchema(schema));
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

/** @internal */
export function validateAsync(schema: JsonSchema, value: any, options?: ValidateOptions): Promise<any>;

export function validateAsync(schema: any, value: any, options: ValidateOptions = { convert: false }): Promise<any> {
  const ajv = getAjvInstance(options.convert);
  const clonedValue = cloneDeep(value);
  const compiled = ajv.compile({
    ...toAjvSchema(schema),
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
