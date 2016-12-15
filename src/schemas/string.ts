import { BaseSchema } from './base';

export class BaseStringSchema<U, V> extends BaseSchema<string, U, V> {

  constructor() {
    super('string');
  }

  format(format?: string) {
    return this.extend({ format });
  }

  maxLength(maxLength?: number) {
    return this.extend({ maxLength });
  }

  minLength(minLength?: number) {
    return this.extend({ minLength });
  }

  pattern(pattern?: string | RegExp) {
    if (pattern instanceof RegExp) {
      return this.extend({ pattern: pattern.source });
    } else {
      return this.extend({ pattern });
    }
  }

  nullable(): BaseStringSchema<null, V> {
    return super.nullable() as BaseStringSchema<null, V>;
  }

  notNullable(): BaseStringSchema<string, V> {
    return super.notNullable() as BaseStringSchema<string, V>;
  }

  optional(): BaseStringSchema<U, undefined> {
    return super.optional() as BaseStringSchema<U, undefined>;
  }

  required(): BaseStringSchema<U, string> {
    return super.required() as BaseStringSchema<U, string>;
  }

}

export class StringSchema extends BaseStringSchema<string, string> {}
