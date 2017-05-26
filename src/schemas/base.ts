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

  readonly exclusiveMaximum?: number

  readonly minimum?: number

  readonly exclusiveMinimum?: number

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

export class Schema<T> {

  readonly props: SchemaProps<T>

  /** @internal */
  constructor(props: SchemaProps<T> = {}) {
    this.props = props
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

  meta(key: string, value: any) {
    return this.extend({
      meta: {
        ...(this.props.meta || {}),
        [key]: value,
      },
    })
  }

  default(defaultValue: T) {
    return this.extend({ default: defaultValue })
  }

  nullable(): Schema<T | null> {
    return this.extend({ nullable: true }) as any as Schema<T | null>
  }

  optional(): Schema<T | undefined> {
    return this.extend({ optional: true }) as any as Schema<T | undefined>
  }

  /** @internal */
  protected extend(properties?: Partial<SchemaProps<T>>): this {
    return Object.assign(
      Object.create(this.constructor.prototype),
      { props: Object.assign({}, this.props, properties) },
    )
  }

}
