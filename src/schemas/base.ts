import { mapObjIndexed } from 'ramda'
import { Maybe } from 'ramda-fantasy'

import { JsonSchema } from '../jsonSchema'

/** @internal */
export type SchemaType = 'string' | 'number' | 'integer' | 'array' | 'object' | 'boolean' | 'null'

export type PropertyMap<T> = {
  [K in keyof T]: Schema<T[K]>;
}

/** @internal */
export interface SchemaProps<T> {

  id?: string

  title?: string

  description?: string

  'default'?: any

  multipleOf?: number

  maximum?: number

  exclusiveMaximum?: boolean

  minimum?: number

  exclusiveMinimum?: boolean

  maxLength?: number

  minLength?: number

  pattern?: string

  additionalItems?: boolean

  items?: Schema<any>

  maxItems?: number

  minItems?: number

  uniqueItems?: boolean

  maxProperties?: number

  minProperties?: number

  required?: string[]

  additionalProperties?: boolean

  properties?: PropertyMap<T>

  enum?: T[]

  type?: SchemaType

  allOf?: Schema<any>[]

  anyOf?: Schema<any>[]

  oneOf?: Schema<any>[]

  not?: Schema<any>

  format?: 'date-time' | 'email' | 'hostname' | 'ipv4' | 'ipv6' | 'uri' | string

  optional?: boolean

  nullable?: boolean

  meta?: {
    [key: string]: any,
  }

}

function getRequiredProperties<T>(props: SchemaProps<T>): Maybe<string[]> {
  const properties = props.properties
  if (!properties) {
    return Maybe.Nothing<string[]>()
  }

  const required = Object.keys(props.properties).filter((key: keyof T) => {
    const property = properties[key]
    return !property.props.optional
  })

  return required.length ? Maybe.Just(required) : Maybe.Nothing<string[]>()
}

export interface Schema<T> {

  readonly _: T

  /** @internal */
  readonly props: SchemaProps<any>

  /** @internal */
  toJsonSchema(): JsonSchema

}

export class BaseSchema<T, U, V, W> implements Schema<T | (U & V) | W> {

  public readonly _: T | (U & V) | W

  /** @internal */
  public readonly props: SchemaProps<T>

  /** @internal */
  public constructor(type?: SchemaType, props: SchemaProps<T> = {}) {
    this.props = Maybe.maybe(
      props,
      (type) => ({ ...props, type }),
      type ? Maybe.Just(type) : Maybe.Nothing<SchemaType>(),
    )
  }

  /** @internal */
  public toJsonSchema(): JsonSchema {
    const { props } = this
    const { properties, items, allOf, anyOf, oneOf, ...copied } = props

    let ret = copied

    ret = Maybe.maybe(
      ret,
      (keys) => ({ ...ret, required: keys }),
      getRequiredProperties(props),
    )

    ret = {
      ...ret,
      properties: properties && mapObjIndexed((childSchema: Schema<any>) => {
        return childSchema.toJsonSchema()
      }, properties),
      items: items && items.toJsonSchema(),
      allOf: allOf && allOf.map(schema => schema.toJsonSchema()),
      anyOf: anyOf && anyOf.map(schema => schema.toJsonSchema()),
      oneOf: oneOf && oneOf.map(schema => schema.toJsonSchema()),
    }

    return ret
  }

  /** @internal */
  public extend(properties?: Partial<SchemaProps<T>>): this {
    const cloned = Object.create(this.constructor.prototype)
    cloned.props = { ...this.props, ...properties as any }
    return cloned
  }

  id(id: string) {
    return this.extend({ id })
  }

  title(title: string) {
    return this.extend({ title })
  }

  description(description: string) {
    return this.extend({ description })
  }

  enum(values: T[]) {
    return this.extend({ enum: values })
  }

  not(schema: Schema<any>) {
    return this.extend({ not: schema })
  }

  meta(key: string, value: any): this;

  meta(key: string): any;

  meta(key: string, value?: any): any {
    if (value !== undefined) {
      return this.extend({
        meta: {
          ...(this.props.meta || {}),
          [key]: value,
        },
      })
    } else {
      return (this.props.meta || {})[key]
    }
  }

  default(defaultValue: T): BaseSchema<T, T, T, W> {
    return this.extend({ default: defaultValue }) as BaseSchema<T, T, T, W>
  }

  nullable(): BaseSchema<T, U, V, null> {
    return this.extend({ nullable: true }) as BaseSchema<T, U, V, null>
  }

  optional(): BaseSchema<T, U, U | undefined, W> {
    return this.extend({ optional: true })
  }

}
