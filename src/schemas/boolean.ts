import { BaseSchema } from './base';

export class BooleanSchema<U, V> extends BaseSchema<boolean, U, V> {

  constructor() {
    super('boolean');
  }

  nullable(): BooleanSchema<null, V> {
    return this.extend({ 'x-nullable': true }) as BooleanSchema<null, V>;
  }

  notNullable(): BooleanSchema<boolean, V> {
    return this.extend({ 'x-nullable': false }) as BooleanSchema<boolean, V>;
  }

  optional(): BooleanSchema<U, undefined> {
    return this.extend({ 'x-optional': true }) as BooleanSchema<U, undefined>;
  }

  required(): BooleanSchema<U, boolean> {
    return this.extend({ 'x-optional': false }) as BooleanSchema<U, boolean>;
  }

}
