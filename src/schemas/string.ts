import { BaseSchema } from './base'

export class StringSchema<U, V> extends BaseSchema<string, U, V> {

  /** @internal */
  constructor () {
    super('string')
  }

  format (format: string) {
    return this.extend({ format })
  }

  maxLength (maxLength: number) {
    return this.extend({ maxLength })
  }

  minLength (minLength: number) {
    return this.extend({ minLength })
  }

  pattern (pattern: string | RegExp) {
    if (pattern instanceof RegExp) {
      return this.extend({ pattern: pattern.source })
    } else {
      return this.extend({ pattern })
    }
  }

}
