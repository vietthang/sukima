import { Schema, PropertyMap, SchemaProps } from './base'
import { mapValues } from '../utils'

function resolveProperties<T>(definitions: PropertyDefinitions<T>): PropertyMap<T> {
  return mapValues(
    (definition: Schema<any> | PropertyDefinitions<any>) => {
      if (definition instanceof Schema) {
        return definition
      } else {
        return new ObjectSchema<T>(definition)
      }
    },
    definitions,
  )
}

export type PropertyDefinitions<T> = {
  [property in keyof T]: Schema<T[property]> | PropertyDefinitions<T[property]>;
}

export class ObjectSchema<T> extends Schema<T> {

  /** @internal */
  public readonly props: SchemaProps<T> & {
    properties: PropertyMap<T>,
  }

  /** @internal */
  constructor(definitions: PropertyDefinitions<T>) {
    super({
      type: 'object',
      properties: resolveProperties(definitions),
    })
  }

  maxProperties(maxProperties: number) {
    return this.extend({ maxProperties })
  }

  minProperties(minProperties: number) {
    return this.extend({ minProperties })
  }

  additionalProperties(): ObjectSchema<T & { [key in any]: any }> {
    return this.extend(
      { additionalProperties: true },
    )
  }

  getPropertyMap(): PropertyMap<T> {
    return this.props.properties
  }

}
