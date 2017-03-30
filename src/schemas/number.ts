import { BaseSchema } from './base'

export class NumberSchema<U, V, W> extends BaseSchema<number, U, V, W> {

  /** @internal */
  constructor(type: 'number' | 'integer' = 'number') {
    super({ type })
  }

  multipleOf(multipleOf: number) {
    return this.extend({ multipleOf })
  }

  maximum(maximum: number) {
    return this.extend({ maximum })
  }

  minimum(minimum: number) {
    return this.extend({ minimum })
  }

  exclusiveMaximum(exclusiveMaximum: boolean) {
    return this.extend({ exclusiveMaximum })
  }

  exclusiveMinimum(exclusiveMinimum: boolean) {
    return this.extend({ exclusiveMinimum })
  }

  default(defaultValue: number): NumberSchema<number, number, W> {
    return this.extend({ default: defaultValue }) as NumberSchema<number, number, W>
  }

  nullable(): NumberSchema<U, V, null> {
    return this.extend({ nullable: true }) as NumberSchema<U, V, null>
  }

  optional(): NumberSchema<U, U | undefined, W> {
    return this.extend({ optional: true })
  }

}
