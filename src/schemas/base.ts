export type SchemaType = 'string' | 'number' | 'integer' | 'array' | 'object' | 'boolean' | 'null'

export type PropertyMap<T> = {
  [K in keyof T]: Schema<T[K]>;
}

export interface SchemaProps<T> {

  readonly id?: string

  readonly title?: string

  readonly description?: string

  readonly 'default'?: T

  readonly multipleOf?: number

  readonly maximum?: number

  readonly exclusiveMaximum?: boolean

  readonly minimum?: number

  readonly exclusiveMinimum?: boolean

  readonly maxLength?: number

  readonly minLength?: number

  readonly pattern?: string

  readonly additionalItems?: boolean

  readonly items?: Schema<any>

  readonly maxItems?: number

  readonly minItems?: number

  readonly uniqueItems?: boolean

  readonly maxProperties?: number

  readonly minProperties?: number

  readonly required?: string[]

  readonly additionalProperties?: boolean

  readonly properties?: PropertyMap<T>

  readonly enum?: T[]

  readonly type?: SchemaType

  readonly allOf?: Schema<any>[]

  readonly anyOf?: Schema<any>[]

  readonly oneOf?: Schema<any>[]

  readonly not?: Schema<any>

  readonly format?: 'date-time' | 'email' | 'hostname' | 'ipv4' | 'ipv6' | 'uri' | string

  readonly optional?: boolean

  readonly nullable?: boolean

  readonly meta?: {
    readonly [key: string]: any,
  }

}

export interface Schema<T> {

  readonly _: T

  /** @internal */
  readonly props: SchemaProps<any>

}

export class BaseSchema<T, U, V, W> implements Schema<T | (U & V) | W> {

  public readonly _: T | (U & V) | W

  /** @internal */
  public readonly props: SchemaProps<T>

  /** @internal */
  public constructor(props: SchemaProps<T> = {}) {
    this.props = props
  }

  /** @internal */
  public extend(properties?: Partial<SchemaProps<T>>): this {
    return Object.assign(
      Object.create(this.constructor.prototype),
      { props: Object.assign({}, this.props, properties) },
    )
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
