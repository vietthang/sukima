import { Schema } from './base';
import { SchemaHash } from './jsonSchema';

function resolveSchemaHash<T>(properties?: PropertyDefinitions<T>) {
  if (!properties) {
    return undefined;
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

export type PropertyDefinitions<T> = {
  [property in keyof T]: Schema<T[property]>
}

export type AdditionalProperties = {
  [property: string]: any,
}

export class ObjectSchema<T, U> extends Schema<T & U> {

  constructor() {
    super('object');
  }

  maxProperties(maxProperties?: number) {
    return this.extend({ maxProperties });
  }

  minProperties(minProperties?: number) {
    return this.extend({ minProperties });
  }

  properties<V>(properties: PropertyDefinitions<V>) {
    const newInstance = new ObjectSchema<T & U, V>();
    newInstance.schema = Object.assign(
      {},
      this.schema,
      {
        properties: Object.assign(
          {},
          this.schema.properties,
          resolveSchemaHash(properties),
        )
      }
    );
    const propertiesKeys = Object.keys(properties);
    if (newInstance.schema.required) {
      newInstance.schema.required = [...new Set<string>(newInstance.schema.required.concat(propertiesKeys))];
    } else {
      newInstance.schema.required = propertiesKeys;
    }
    return newInstance;
  }

  optionalProperties<V>(properties: PropertyDefinitions<V>) {
    const newInstance = new ObjectSchema<T & Partial<U>, V>();
    newInstance.schema = Object.assign(
      {},
      this.schema,
      {
        properties: Object.assign(
          {},
          this.schema.properties,
          resolveSchemaHash(properties),
        )
      }
    );
    return newInstance;
  }

  allowAdditionalProperties() {
    const newInstance = new ObjectSchema<T, AdditionalProperties>();
    newInstance.schema = Object.assign(
      {},
      this.schema,
      { additionalProperties: true },
    );
    return newInstance;
  }

  disallowAdditionalProperties() {
    const newInstance = new ObjectSchema<T, void>();
    newInstance.schema = Object.assign(
      {},
      this.schema,
      { additionalProperties: false },
    );
    return newInstance;
  }

}
