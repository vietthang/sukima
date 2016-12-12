import { Schema } from './base';

export class StringSchema extends Schema<string> {

  constructor() {
    super('string');
  }

  format(format?: 'uri' | 'email' | 'uuid') {
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

}