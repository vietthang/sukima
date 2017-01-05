import { Schema } from './schemas/base';
import { JsonSchema } from './jsonSchema';
import Ajv = require('ajv');

export interface ValidateOptions {
  convert: boolean;
}

class ValidationError extends Error {

  public readonly errors: Ajv.ErrorObject[];

  public readonly source: any;

  constructor(source: any, errors: Ajv.ErrorObject[]) {
    super('Validation Error');
    this.source = source;
    this.errors = errors;
  }

}

class UnknownError extends Error {

  constructor() {
    super('Unknown Error');
  }

}

export function validate<T>(schema: Schema<T>, value: any, options?: ValidateOptions): T;

export function validate(schema: JsonSchema, value: any, options?: ValidateOptions): any;

export function validate(schema: any, value: any, options: ValidateOptions = { convert: false }): any {
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
  const ajv = new Ajv({
    useDefaults: true,
    coerceTypes: options.convert ? 'array' : false,
  });

  ajv.addKeyword('ajv-convert', {

    validate(
      schema: any,
      data: any,
      parentSchema?: Object,
      dataPath?: string,
      parentData?: Object | Array<any>,
      parentDataProperty?: string | number,
    ): boolean {
      // schema.convert
    }

  })

  let clonedValue: any;
  if (typeof value === 'object' && value !== null) {
    clonedValue = JSON.parse(JSON.stringify(value));
  } else {
    clonedValue = value;
  }
  const jsonSchema = schema instanceof Schema ? schema.getJsonSchema() : schema;
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
