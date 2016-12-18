import { JsonSchema } from '../jsonSchema';

export interface InternalJsonSchema extends JsonSchema {

  'x-nullable'?: boolean;

  'x-optional'?: boolean;

  'x-private'?: any;

}

function evictUndefined(value: any): any {
  if (value === null) {
    return null;
  }

  if ('object' !== typeof value) {
    return value;
  }

  if (Array.isArray(value)) {
    return value;
  }

  return Object.keys(value)
    .filter(key => value[key] !== undefined && key !== 'x-private')
    .reduce((prevValue, key) => {
      return {
        ...prevValue,
        [key]: evictUndefined(value[key]),
      };
    }, {});
}

export class Schema<T> {

  public value = {} as T;

  protected schema: InternalJsonSchema;

  public constructor(type?: string) {
    this.schema = { type };
  }

  public extend(properties?: Partial<InternalJsonSchema>): this {
    const cloned = Object.create(this.constructor.prototype);
    cloned.schema = { ...this.schema, ...properties };
    return cloned;
  }

  getJsonSchema() {
    return evictUndefined(this.schema) as JsonSchema;
  }

  id(id?: string) {
    return this.extend({ id });
  }

  title(title?: string) {
    return this.extend({ title });
  }

  description(description?: string) {
    return this.extend({ description });
  }

  default(defaultValue?: T) {
    return this.extend({ default: defaultValue });
  }

  exclusiveMaximum(exclusiveMaximum?: boolean) {
    return this.extend({ exclusiveMaximum });
  }

  exclusiveMinimum(exclusiveMinimum?: boolean) {
    return this.extend({ exclusiveMinimum });
  }

  enum(values?: T[]) {
    return this.extend({ enum: values });
  }

  not<U>(schema?: Schema<U>) {
    return this.extend({ not: schema ? schema.getJsonSchema() : undefined });
  }

  allOf(schemas?: Schema<T>[]) {
    return this.extend({ allOf: schemas ? schemas.map(subSchema => subSchema.getJsonSchema()) : undefined });
  }

  anyOf(schemas?: Schema<T>[]) {
    return this.extend({ anyOf: schemas ? schemas.map(subSchema => subSchema.getJsonSchema()) : undefined });
  }

  oneOf(schemas?: Schema<T>[]) {
    return this.extend({ oneOf: schemas ? schemas.map(subSchema => subSchema.getJsonSchema()) : undefined });
  }

}

export abstract class BaseSchema<T, U, V> extends Schema<T | U | V> {

  nullable(): BaseSchema<T, null, V> {
    return this.extend({ 'x-nullable': true }) as BaseSchema<T, null, V>;
  }

  notNullable(): BaseSchema<T, T, V> {
    return this.extend({ 'x-nullable': false }) as BaseSchema<T, T, V>;
  }

  optional(): BaseSchema<T, U, undefined> {
    return this.extend({ 'x-optional': true }) as BaseSchema<T, U, undefined>;
  }

  required(): BaseSchema<T, U, T> {
    return this.extend({ 'x-optional': false }) as BaseSchema<T, U, T>;
  }

}
