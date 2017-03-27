import { BaseSchema } from './base'

export class StringSchema<U, V, W> extends BaseSchema<string, U, V, W> {

  /** @internal */
  constructor() {
    super('string')
  }

  format(format: string) {
    return this.extend({ format })
  }

  maxLength(maxLength: number) {
    return this.extend({ maxLength })
  }

  minLength(minLength: number) {
    return this.extend({ minLength })
  }

  pattern(pattern: string | RegExp) {
    if (pattern instanceof RegExp) {
      return this.extend({ pattern: pattern.source })
    } else {
      return this.extend({ pattern })
    }
  }

  default(defaultValue: string): StringSchema<string, string, W> {
    return this.extend({ default: defaultValue }) as StringSchema<string, string, W>
  }

  nullable(): StringSchema<U, V, null> {
    return this.extend({ nullable: true }) as StringSchema<U, V, null>
  }

  optional(): StringSchema< U, U | undefined, W> {
    return this.extend({ optional: true })
  }

}
