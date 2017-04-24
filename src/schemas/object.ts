import { Schema, BaseSchema, PropertyMap, SchemaProps } from './base'
import { mapValues } from '../utils'

function resolveProperties<T>(definitions: PropertyDefinitions<T>): PropertyMap<T> {
  return mapValues(
    (definition: Schema<any> | PropertyDefinitions<any>) => {
      if (definition instanceof BaseSchema) {
        return definition
      } else {
        return new ObjectSchema<T, never, T, never>(definition)
      }
    },
    definitions,
  )
}

export type PropertyDefinitions<T> = {
  [property in keyof T]: Schema<T[property]> | PropertyDefinitions<T[property]>;
}

export class ObjectSchema<T, U, V, W> extends BaseSchema<T, U, V, W> {

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

  additionalProperties(allow: boolean = true) {
    return this.extend(
      { additionalProperties: allow },
    )
  }

  default(defaultValue: T): ObjectSchema<T, T, T, W> {
    return this.extend({ default: defaultValue }) as ObjectSchema<T, T, T, W>
  }

  nullable(): ObjectSchema<T, U, V, null> {
    return this.extend({ nullable: true }) as ObjectSchema<T, U, V, null>
  }

  optional(): ObjectSchema<T, U, U | undefined, W> {
    return this.extend({ optional: true })
  }

  getPropertyMap(): PropertyMap<T> {
    return this.props.properties
  }

}
