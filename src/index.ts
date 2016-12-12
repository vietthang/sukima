import { StringSchema } from './schemas/string';
import { NumberSchema } from './schemas/number';
import { BooleanSchema } from './schemas/boolean';
import { ObjectSchema, Empty } from './schemas/object';
import { ArraySchema } from './schemas/array';
import { NullSchema } from './schemas/null';

export function string() {
  return new StringSchema<string, string>();
}

export function number() {
  return new NumberSchema<number, number>();
}

export function integer() {
  return new NumberSchema<number, number>('integer');
}

export function boolean() {
  return new BooleanSchema<boolean, boolean>();
}

export function object() {
  return new ObjectSchema<Empty, Empty, Empty, Empty, Empty>();
}

export function array() {
  return new ArraySchema<any, any, any>();
}

export function nil() {
  return new NullSchema<null>();
}
