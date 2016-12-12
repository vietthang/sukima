import { BaseSchema, Schema } from './base';
import { SchemaHash } from './jsonSchema';

function resolveSchemaHash<T>(properties?: PropertyDefinitions<T>) {
  if (!properties) {
    return {} as SchemaHash;
  } else {
    const schemaHash: SchemaHash = {};
    const keys = Object.keys(properties) as any as (keyof T)[];
    keys.forEach((key) => {
      const options = properties[key];

      if (!options) {
        return;
      }

      if (options instanceof Schema) {
        schemaHash[key as string] = options.getJsonSchema();
      } else {
        schemaHash[key as string] = {
          type: 'object',
          properties: resolveSchemaHash(options),
        };
      }
    });
    return schemaHash;
  }
}

function mergeProperties(
  properties: SchemaHash,
  optionalProperties: SchemaHash) {
  return {
    properties: {
      ...properties,
      ...optionalProperties,
    },
    required: Object.keys(properties),
    'x-nullable': undefined,
    'x-optional': undefined,
  };
}

export type PropertyDefinitions<T> = {
  [property in keyof T]: Schema<T[property]> | PropertyDefinitions<T[property]> | undefined;
}

export interface Empty {
  readonly __never?: never;
}

export class ObjectSchema<T1, U1, V1, Nullable, Optional> extends BaseSchema<T1 & U1 & V1, Nullable, Optional> {

  protected internal: {
    properties: SchemaHash,
    optionalProperties: SchemaHash,
  }

  constructor() {
    super('object');
  }

  maxProperties(maxProperties?: number) {
    return this.extend({ maxProperties });
  }

  minProperties(minProperties?: number) {
    return this.extend({ minProperties });
  }

  properties<T2>(properties?: PropertyDefinitions<T2>) {
    const props = {
      properties: resolveSchemaHash(properties)
    }

    return this.extend(
      mergeProperties(props.properties, this.internal.optionalProperties),
      props,
    ) as any as ObjectSchema<T2, U1, V1, T2 & U1 & V1, T2 & U1 & V1>;
  }

  addProperties<W>(properties: PropertyDefinitions<W>) {
    const props = {
      properties: {
        ...this.internal.properties,
        ...resolveSchemaHash(properties),
      }
    }

    return this.extend(
      mergeProperties(props.properties, this.internal.optionalProperties),
      props,
    ) as any as ObjectSchema<T1 & W, U1, V1, T1 & W & U1 & V1, T1 & W & U1 & V1>;
  }

  optionalProperties<W>(properties?: PropertyDefinitions<W>) {
    const props = {
      optionalProperties: resolveSchemaHash(properties),
    }

    return this.extend(
      mergeProperties(this.internal.properties, props.optionalProperties),
      props,
    ) as any as ObjectSchema<T1, Partial<W>, V1, T1 & Partial<W> & V1, T1 & Partial<W> & V1>;
  }

  addOptionalProperties<W>(properties: PropertyDefinitions<W>) {
    const props = {
      optionalProperties: {
        ...this.internal.optionalProperties,
        ...resolveSchemaHash(properties),
      }
    }

    return this.extend(
      mergeProperties(this.internal.properties, props.optionalProperties),
      props,
    ) as any as ObjectSchema<T1, U1 & Partial<W>, V1, T1 & U1 & Partial<W> & V1, T1 & U1 & Partial<W> & V1>;
  }

  allowAdditionalProperties() {
    return this.extend(
      { additionalProperties: true }
    ) as any as ObjectSchema<T1, U1, {}, Nullable, Optional>;
  }

  disallowAdditionalProperties() {
    return this.extend(
      { additionalProperties: false }
    ) as any as ObjectSchema<T1, U1, Empty, Nullable, Optional>;
  }

  nullable(): ObjectSchema<T1, U1, V1, null, Optional> {
    return this.extend({ 'x-nullable': true }) as ObjectSchema<T1, U1, V1, null, Optional>;
  }

  notNullable(): ObjectSchema<T1, U1, V1, T1 & U1 & V1, Optional> {
    return this.extend({ 'x-nullable': false }) as ObjectSchema<T1, U1, V1, T1 & U1 & V1, Optional>;
  }

  optional(): ObjectSchema<T1, U1, V1, Nullable, undefined> {
    return this.extend({ 'x-optional': true }) as ObjectSchema<T1, U1, V1, Nullable, undefined>;
  }

  required(): ObjectSchema<T1, U1, V1, Nullable, T1 & U1 & V1> {
    return this.extend({ 'x-optional': false }) as ObjectSchema<T1, U1, V1, Nullable, T1 & U1 & V1>;
  }

}
