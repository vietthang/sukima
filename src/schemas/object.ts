import { mapObjIndexed } from 'ramda'

import { Schema, BaseSchema, PropertyMap } from './base'

function resolveProperties<T> (definitions: PropertyDefinitions<T>): PropertyMap<T> {
  return mapObjIndexed((definition: Schema<any> | PropertyDefinitions<any>) => {
    if (definition instanceof BaseSchema) {
      return definition
    } else {
      return new ObjectSchema<any, any, any>().properties(definition)
    }
  }, definitions)
}

export type PropertyDefinitions<T> = {
  [property in keyof T]: Schema<T[property]> | PropertyDefinitions<T[property]>;
}

export class ObjectSchema<T extends object, U, V> extends BaseSchema<T, U, V> {

  /** @internal */
  constructor () {
    super('object')
  }

  maxProperties (maxProperties: number) {
    return this.extend({ maxProperties })
  }

  minProperties (minProperties: number) {
    return this.extend({ minProperties })
  }

  properties<T2 extends object> (definitions: PropertyDefinitions<T2>) {
    return this.extend(
      {
        properties: resolveProperties(definitions) as any,
      },
    ) as any as ObjectSchema<T2, U, V>
  }

  addProperties<W> (definitions: PropertyDefinitions<W>): ObjectSchema<T & W, U, V> {
    return this.properties({
      ...this.props.properties as any,
      ...definitions as any,
    }) as ObjectSchema<T & W, U, V>
  }

  addProperty<K extends string, V> (key: K, schema: Schema<V> | PropertyDefinitions<V>) {
    return this.addProperties({ [key as string]: schema } as any as PropertyDefinitions<{ [P in K]: V }>)
  }

  getPropertySchema<K extends keyof T> (key: K) {
    const { properties = {} as PropertyMap<T | U> } = this.props

    return properties[key as any] as Schema<T[K]>
  }

  additionalProperties (allow: boolean = true) {
    return this.extend(
      { additionalProperties: allow },
    )
  }

  pick<Key extends keyof T> (...keys: Key[]) {
    const { properties = {} as PropertyMap<T | U> } = this.props

    const propertyKeys = Object.keys(properties)
      .filter(key => keys.indexOf(key as any) !== -1)

    return this.extend({
      properties: propertyKeys
        .reduce(
          (prevValue, key) => {
            return {
              ...prevValue,
              [key]: properties[key],
            }
          },
          {} as PropertyMap<any>,
        ),
    }) as any as ObjectSchema<{ [property in Key]: T[property] }, U, V>
  }

  keys (): (keyof T)[] {
    const { properties } = this.props

    if (!properties) {
      return []
    } else {
      return Object.keys(properties) as (keyof T)[]
    }
  }

}
