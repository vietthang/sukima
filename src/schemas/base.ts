import { JsonSchema, PropertyMap } from '../jsonSchema';

export interface InternalJsonSchema extends JsonSchema {

  'x-nullable'?: boolean;

  'x-optional'?: boolean;

}

function evictUndefined(value: any): any {
  if (value === null) {
    return null;
  }

  if ('object' !== typeof value) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(evictUndefined);
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

function resolveXNullable(schema: InternalJsonSchema): JsonSchema {
  if (schema['x-nullable'] || schema['x-optional']) {
    const values = [];
    if (schema['x-nullable']) {
      values.push(null);
    }
    if (schema['x-optional']) {
      values.push(undefined);
    }
    return {
      anyOf: [
        {
          enum: values,
        },
        resolveXNullable(
          {
            ...schema,
            'x-nullable': undefined,
            'x-optional': undefined,
          },
        ),
      ]
    };
  }

  if (!schema.properties) {
    return schema;
  }

  const properties = schema.properties;

  const newProperties = Object
    .keys(properties)
    .map((key) => {
      return {
        key,
        value: resolveXNullable(properties[key]),
      }
    })
    .reduce(
      (prevValue, { key, value }) => {
        return {
          ...prevValue,
          [key]: value,
        };
      },
      {} as PropertyMap,
    );

  return {
    ...schema,
    properties: newProperties,
  }
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
    return evictUndefined(resolveXNullable(this.schema)) as JsonSchema;
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

  getPropertySchema<K extends keyof T>(key: K): Schema<T[K]> {
    if (Array.isArray(this.schema.type)) {
      throw new Error('JSON schema with type is an array is not supported.');
    }
    if (!this.schema.type) {
      throw new Error('JSON schema does not contain type.');
    }
    if (!this.schema.properties) {
      throw new Error('JSON schema does not contain properties.');
    }
    if (!this.schema.properties[key]) {
      throw new Error(`JSON schema does not contain key ${key}`);
    }
    return new Schema<T[K]>(this.schema.type).extend(this.schema.properties[key]);
  }

  getPartialSchema(): Schema<Partial<T>> {
    return this.extend({ required: undefined }) as Schema<Partial<T>>;
  }

  nullable(): Schema<T | null> {
    return this.extend({ 'x-nullable': true }) as Schema<T | null>;
  }

  optional(): Schema<T | undefined> {
    return this.extend({ 'x-optional': true }) as Schema<T | undefined>;
  }

}
