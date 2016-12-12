import { BaseSchema } from './base';

export class NullSchema<V> extends BaseSchema<null, null, V> {

  constructor() {
    super('null');
  }

  nullable(): NullSchema<V> {
    return this.extend({ 'x-nullable': true }) as NullSchema<V>;
  }

  notNullable(): NullSchema<V> {
    return this.extend({ 'x-nullable': false }) as NullSchema<V>;
  }

  optional(): NullSchema<undefined> {
    return this.extend({ 'x-optional': true }) as NullSchema<undefined>;
  }

  required(): NullSchema<null> {
    return this.extend({ 'x-optional': false }) as NullSchema<null>;
  }

}
