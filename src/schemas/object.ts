import { Schema, InternalJsonSchema } from './base';
import { PropertyMap } from '../jsonSchema';

function resolveSchemaHash<T>(definitions?: PropertyDefinitions<T>) {
  if (!definitions) {
    return {} as PropertyMap;
  } else {
    const schemaHash: PropertyMap = {};
    const keys = Object.keys(definitions) as any as (keyof T)[];
    keys.forEach((key) => {
      const options = definitions[key];

      if (!options) {
        return;
      }

      if (options instanceof Schema) {
        schemaHash[key as string] = options.getJsonSchema();
      } else {
        const properties = resolveSchemaHash(options);

        schemaHash[key as string] = {
          type: 'object',
          properties: properties,
          required: getRequiredProperties(properties),
        };
      }
    });
    return schemaHash;
  }
}

function getRequiredProperties(properties: PropertyMap): string[] {
  return Object.keys(properties).filter((key) => {
    const property: InternalJsonSchema = properties[key];
    return !property['x-optional'];
  })
}

export type PropertyDefinitions<T> = {
  [property in keyof T]: Schema<T[property]> | PropertyDefinitions<T[property]> | undefined;
};

export interface Empty {
  readonly __never?: never;
}

export class BaseObjectSchema<T, U> extends Schema<T | U> {

  constructor() {
    super('object');
  }

  maxProperties(maxProperties?: number) {
    return this.extend({ maxProperties });
  }

  minProperties(minProperties?: number) {
    return this.extend({ minProperties });
  }

  properties<T2>(definitions?: PropertyDefinitions<T2>) {
    const properties = resolveSchemaHash(definitions);
    const required = getRequiredProperties(properties);

    return this.extend(
      {
        properties: properties,
        required: required,
      },
    ) as any as BaseObjectSchema<T2, U>;
  }

  addProperties<W>(definitions: PropertyDefinitions<W>) {
    const properties = {
      ...this.schema.properties,
      ...resolveSchemaHash(definitions),
    };
    const required = getRequiredProperties(properties);

    return this.extend(
      {
        properties,
        required,
      },
    ) as any as BaseObjectSchema<T & W, U>;
  }

  additionalProperties(allow: boolean = true) {
    return this.extend(
      { additionalProperties: allow }
    );
  }

  nullable(): BaseObjectSchema<T, U | null> {
    return super.nullable() as BaseObjectSchema<T, U | null>;
  }

  optional(): BaseObjectSchema<T, U | undefined> {
    return super.optional() as BaseObjectSchema<T, U | undefined>;
  }

}

export class ObjectSchema<T> extends BaseObjectSchema<T, T> {};
