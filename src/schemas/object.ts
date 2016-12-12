import { Schema } from './base';
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
  };
}

export type PropertyDefinitions<T> = {
  [property in keyof T]: Schema<T[property]> | PropertyDefinitions<T[property]>;
}

export interface Never {
  __never?: never;
}

export class ObjectSchema<T, U, V> extends Schema<T & U & V> {

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

  properties<W>(properties?: PropertyDefinitions<W>) {
    const props = {
      properties: resolveSchemaHash(properties)
    }

    return this.extend(
      mergeProperties(props.properties, this.internal.optionalProperties),
      props,
    ) as any as ObjectSchema<W, U, V>;
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
    ) as any as ObjectSchema<T & W, U, V>;
  }

  optionalProperties<W>(properties?: PropertyDefinitions<W>) {
    const props = {
      optionalProperties: resolveSchemaHash(properties),
    }

    return this.extend(
      mergeProperties(this.internal.properties, props.optionalProperties),
      props,
    ) as any as ObjectSchema<T, Partial<W>, V>;
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
    ) as any as ObjectSchema<T, U & Partial<W>, V>;
  }

  allowAdditionalProperties() {
    return this.extend(
      { additionalProperties: true }
    ) as any as ObjectSchema<T, U, {}>;
  }

  disallowAdditionalProperties() {
    return this.extend(
      { additionalProperties: false }
    ) as any as ObjectSchema<T, U, Never>;
  }

}
