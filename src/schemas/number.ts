import { Schema } from './base'

export class BaseNumberSchema<T> extends Schema<T> {

  /** @internal */
  constructor (type: 'number' | 'integer' = 'number') {
    super(type)
  }

  multipleOf (multipleOf: number) {
    return this.extend({ multipleOf })
  }

  maximum (maximum: number) {
    return this.extend({ maximum })
  }

  minimum (minimum: number) {
    return this.extend({ minimum })
  }

  nullable (): BaseNumberSchema<T | null> {
    return super.nullable() as BaseNumberSchema<T | null>
  }

  optional (): BaseNumberSchema<T | undefined> {
    return super.optional() as BaseNumberSchema<T | undefined>
  }

}

export class NumberSchema extends BaseNumberSchema<number> {};
