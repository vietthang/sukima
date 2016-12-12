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

      schemaHash[key as string] = options.getJsonSchema();
    });
    return schemaHash;
  }
}

function mergeProperties(
  properties: SchemaHash,
  optionalProperties: SchemaHash) {
  return Object.assign(
    {},
    {
      properties: Object.assign(
        {},
        properties,
        optionalProperties,
      ),
      required: Object.keys(properties),
    }
  );
}

export type PropertyDefinitions<T> = {
  [property in keyof T]: Schema<T[property]>
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
    this.internal.properties = resolveSchemaHash(properties);

    return this.extend(
      mergeProperties(this.internal.properties, this.internal.optionalProperties)
    ) as any as ObjectSchema<W, U, V>;
  }

  addProperties<W>(properties: PropertyDefinitions<W>) {
    this.internal.properties = Object.assign(
      {},
      this.internal.properties,
      resolveSchemaHash(properties),
    )

    return this.extend(
      mergeProperties(this.internal.properties, this.internal.optionalProperties)
    ) as any as ObjectSchema<T & W, U, V>;
  }

  optionalProperties<W>(properties?: PropertyDefinitions<W>) {
    this.internal.optionalProperties = resolveSchemaHash(properties);

    return this.extend(
      mergeProperties(this.internal.properties, this.internal.optionalProperties)
    ) as any as ObjectSchema<T, Partial<W>, V>;
  }

  addOptionalProperties<W>(properties: PropertyDefinitions<W>) {
    this.internal.optionalProperties = Object.assign(
      {},
      this.internal.optionalProperties,
      resolveSchemaHash(properties),
    )

    return this.extend(
      mergeProperties(this.internal.properties, this.internal.optionalProperties)
    ) as any as ObjectSchema<T, U & Partial<W>, V>;
  }

  allowAdditionalProperties() {
    const newInstance = new ObjectSchema<T, U, {}>();
    newInstance.schema = Object.assign(
      {},
      this.schema,
      { additionalProperties: true },
    );
    return newInstance;
  }

  disallowAdditionalProperties() {
    const newInstance = new ObjectSchema<T, U, Never>();
    newInstance.schema = Object.assign(
      {},
      this.schema,
      { additionalProperties: false },
    );
    return newInstance;
  }

}
