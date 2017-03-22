import { Schema } from './base'

export class BaseStringSchema<T> extends Schema<T> {

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

  nullable (): BaseStringSchema<T | null> {
    return super.nullable() as BaseStringSchema<T | null>
  }

  optional (): BaseStringSchema<T | undefined> {
    return super.optional() as BaseStringSchema<T | undefined>
  }

}

export class StringSchema extends BaseStringSchema<string> {}
