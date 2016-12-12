import { BaseSchema } from './base';

export class NumberSchema<U, V> extends BaseSchema<number, U, V> {

  constructor(type: 'number' | 'integer' = 'number') {
    super(type);
  }

  multipleOf(multipleOf?: number) {
    return this.extend({ multipleOf });
  }

  maximum(maximum?: number) {
    return this.extend({ maximum });
  }

  minimum(minimum?: number) {
    return this.extend({ minimum });
  }

  nullable(): NumberSchema<null, V> {
    return this.extend({ 'x-nullable': true }) as NumberSchema<null, V>;
  }

  notNullable(): NumberSchema<number, V> {
    return this.extend({ 'x-nullable': false }) as NumberSchema<number, V>;
  }

  optional(): NumberSchema<U, undefined> {
    return this.extend({ 'x-optional': true }) as NumberSchema<U, undefined>;
  }

  required(): NumberSchema<U, number> {
    return this.extend({ 'x-optional': false }) as NumberSchema<U, number>;
  }

}
