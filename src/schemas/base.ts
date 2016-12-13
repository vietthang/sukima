import { JsonSchema } from './jsonSchema';

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
    .filter(key => value[key] !== undefined)
    .reduce((prevValue, key) => {
      return {
        ...prevValue,
        [key]: evictUndefined(value[key]),
      };
    }, {});
}

export abstract class Schema<T> {

  public value = {} as T;

  protected schema: JsonSchema;

  protected internal: any;

  protected constructor(type?: string) {
    this.schema = { type };
    this.internal = {};
  }

  protected extend(properties?: Partial<JsonSchema>, internal?: any): this {
    const cloned = Object.create(this.constructor.prototype);
    cloned.schema = { ...this.schema, ...properties };
    cloned.internal = { ...this.internal, ...internal };
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

  abstract nullable(): BaseSchema<T, null, V>;

  abstract notNullable(): BaseSchema<T, T, V>;

  abstract optional(): BaseSchema<T, U, undefined>;

  abstract required(): BaseSchema<T, U, T>;

}
