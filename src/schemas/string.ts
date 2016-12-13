import { BaseSchema } from './base';

export class StringSchema<U, V> extends BaseSchema<string, U, V> {

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
    return this.extend({ pattern: pattern ? pattern.toString() : undefined });
  }

  nullable(): StringSchema<null, V> {
    return this.extend({ 'x-nullable': true }) as StringSchema<null, V>;
  }

  notNullable(): StringSchema<string, V> {
    return this.extend({ 'x-nullable': false }) as StringSchema<string, V>;
  }

  optional(): StringSchema<U, undefined> {
    return this.extend({ 'x-optional': true }) as StringSchema<U, undefined>;
  }

  required(): StringSchema<U, string> {
    return this.extend({ 'x-optional': false }) as StringSchema<U, string>;
  }

}