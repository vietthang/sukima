import { Schema } from './base'

export class NumberSchema extends Schema<number> {

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

}
