import { BaseSchema } from './base';

export class BaseNumberSchema<U, V> extends BaseSchema<number, U, V> {

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

  nullable(): BaseNumberSchema<null, V> {
    return super.nullable() as BaseNumberSchema<null, V>;
  }

  notNullable(): BaseNumberSchema<number, V> {
    return super.notNullable() as BaseNumberSchema<number, V>;
  }

  optional(): BaseNumberSchema<U, undefined> {
    return super.optional() as BaseNumberSchema<U, undefined>;
  }

  required(): BaseNumberSchema<U, number> {
    return super.required() as BaseNumberSchema<U, number>;
  }

}

export class NumberSchema extends BaseNumberSchema<number, number> {};
