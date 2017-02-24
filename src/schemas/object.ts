import mapValues = require('lodash/mapValues');

import { Schema, PropertyMap } from './base';

function resolveProperties<T>(definitions: PropertyDefinitions<T>): PropertyMap<T> {
  return mapValues(definitions, (definition: Schema<any> | PropertyDefinitions<any>) => {
    if (definition instanceof Schema) {
      return definition;
    } else {
      return new BaseObjectSchema<any, any>().properties(definition);
    }
  }) as any as PropertyMap<T>;
}

export type PropertyDefinitions<T> = {
  [property in keyof T]: Schema<T[property]> | PropertyDefinitions<T[property]>;
};

export class BaseObjectSchema<T extends {}, U> extends Schema<T | U> {

  /** @internal */
  constructor() {
    super('object');
  }

  maxProperties(maxProperties: number) {
    return this.extend({ maxProperties });
  }

  minProperties(minProperties: number) {
    return this.extend({ minProperties });
  }

  properties<T2>(definitions: PropertyDefinitions<T2>) {
    return this.extend(
      {
        properties: resolveProperties(definitions) as any,
      },
    ) as any as BaseObjectSchema<T2, U>;
  }

  addProperties<W>(definitions: PropertyDefinitions<W>) {
    return this.properties({
      ...this.props.properties as any,
      ...definitions as any,
    })
  }

  addProperty<K extends string, V>(key: K, schema: Schema<V> | PropertyDefinitions<V>) {
    return this.addProperties({ [key as string]: schema } as any as PropertyDefinitions<{ [P in K]: V }>);
  }

  getPropertySchema<K extends keyof T>(key: K) {
    const properties = this.props.properties;

    if (!properties) {
      throw new Error('This schema does not contain any properties');
    }

    return properties[key as any] as Schema<T[K]>;
  }

  getPartialSchema(): BaseObjectSchema<Partial<T>, U> {
    const { properties } = this.props;

    if (!properties) {
      return this;
    }

    return this.extend({
      properties: mapValues(properties, (schema: Schema<any>) => schema.optional())
    }) as BaseObjectSchema<Partial<T>, U>;
  }

  additionalProperties(allow: boolean = true) {
    return this.extend(
      { additionalProperties: allow }
    );
  }

  pick<Key extends keyof T>(...keys: Key[]) {
    const properties = this.props.properties;

    if (!properties) {
      throw new Error('This schema does not contain any properties');
    }

    const propertyKeys = Object.keys(properties)
      .filter(key => keys.indexOf(key as any) !== -1);

    return this.extend({
      properties: propertyKeys
        .reduce(
          (prevValue, key) => {
            return {
              ...prevValue,
              [key]: properties[key],
            };
          },
          {} as PropertyMap<any>,
        ),
    }) as any as BaseObjectSchema<{ [property in Key]: T[property] }, { [property in Key]: T[property] }>;
  }

  nullable(): BaseObjectSchema<T, U | null> {
    return super.nullable() as BaseObjectSchema<T, U | null>;
  }

  optional(): BaseObjectSchema<T, U | undefined> {
    return super.optional() as BaseObjectSchema<T, U | undefined>;
  }

  keys(): (keyof T)[] {
    const { properties } = this.props;

    if (!properties) {
      return [];
    } else {
      return Object.keys(properties) as (keyof T)[];
    }
  }

}

export class ObjectSchema<T> extends BaseObjectSchema<T, never> {};
