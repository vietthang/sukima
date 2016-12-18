import { BaseSchema, Schema } from './base';
import { PropertyMap } from '../jsonSchema';

function resolveSchemaHash<T>(properties?: PropertyDefinitions<T>) {
  if (!properties) {
    return {} as PropertyMap;
  } else {
    const schemaHash: PropertyMap = {};
    const keys = Object.keys(properties) as any as (keyof T)[];
    keys.forEach((key) => {
      const options = properties[key];

      if (!options) {
        return;
      }

      if (options instanceof Schema) {
        schemaHash[key as string] = options.getJsonSchema();
      } else {
        const resolvedProperties = resolveSchemaHash(options);

        schemaHash[key as string] = {
          type: 'object',
          properties: resolvedProperties,
          required: Object.keys(resolvedProperties),
        };
      }
    });
    return schemaHash;
  }
}

function mergeProperties(
  properties: PropertyMap,
  optionalProperties: PropertyMap) {
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
};

export interface Empty {
  readonly __never?: never;
}

export class BaseObjectSchema<T1, U1, V1, Nullable, Optional> extends BaseSchema<T1 & U1 & V1, Nullable, Optional> {

  protected internal: {
    properties: PropertyMap,
    optionalProperties: PropertyMap,
  }

  constructor() {
    super('object');
    this.schema['x-private'] = {};
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
      mergeProperties(props.properties, this.schema['x-private'].optionalProperties),
    ) as any as BaseObjectSchema<T2, U1, V1, T2 & U1 & V1, T2 & U1 & V1>;
  }

  addProperties<W>(properties: PropertyDefinitions<W>) {
    const props = {
      properties: {
        ...this.schema['x-private'].properties,
        ...resolveSchemaHash(properties),
      }
    }

    return this.extend(
      mergeProperties(props.properties, this.schema['x-private'].optionalProperties),
    ) as any as BaseObjectSchema<T1 & W, U1, V1, T1 & W & U1 & V1, T1 & W & U1 & V1>;
  }

  optionalProperties<W>(properties?: PropertyDefinitions<W>) {
    const props = {
      optionalProperties: resolveSchemaHash(properties),
    }

    return this.extend(
      mergeProperties(this.schema['x-private'].properties, props.optionalProperties),
    ) as any as BaseObjectSchema<T1, Partial<W>, V1, T1 & Partial<W> & V1, T1 & Partial<W> & V1>;
  }

  addOptionalProperties<W>(properties: PropertyDefinitions<W>) {
    const props = {
      optionalProperties: {
        ...this.schema['x-private'].optionalProperties,
        ...resolveSchemaHash(properties),
      }
    }

    return this.extend(
      mergeProperties(this.schema['x-private'].properties, props.optionalProperties),
    ) as any as BaseObjectSchema<T1, U1 & Partial<W>, V1, T1 & U1 & Partial<W> & V1, T1 & U1 & Partial<W> & V1>;
  }

  allowAdditionalProperties() {
    return this.extend(
      { additionalProperties: true }
    ) as any as BaseObjectSchema<T1, U1, {}, Nullable, Optional>;
  }

  disallowAdditionalProperties() {
    return this.extend(
      { additionalProperties: false }
    ) as any as BaseObjectSchema<T1, U1, Empty, Nullable, Optional>;
  }

  nullable(): BaseObjectSchema<T1, U1, V1, null, Optional> {
    return super.notNullable() as BaseObjectSchema<T1, U1, V1, null, Optional>;
  }

  notNullable(): BaseObjectSchema<T1, U1, V1, T1 & U1 & V1, Optional> {
    return super.notNullable() as BaseObjectSchema<T1, U1, V1, T1 & U1 & V1, Optional>;
  }

  optional(): BaseObjectSchema<T1, U1, V1, Nullable, undefined> {
    return super.optional() as BaseObjectSchema<T1, U1, V1, Nullable, undefined>;
  }

  required(): BaseObjectSchema<T1, U1, V1, Nullable, T1 & U1 & V1> {
    return super.required() as BaseObjectSchema<T1, U1, V1, Nullable, T1 & U1 & V1>;
  }

}

export class ObjectSchema extends BaseObjectSchema<Empty, Empty, Empty, Empty, Empty> {};
