import { StringSchema } from './schemas/string';
import { NumberSchema } from './schemas/number';
import { BooleanSchema } from './schemas/boolean';
import { ObjectSchema } from './schemas/object';
import { ArraySchema } from './schemas/array';
import { NullSchema } from './schemas/null';

export function string() {
  return new StringSchema();
}

export function number() {
  return new NumberSchema();
}

export function integer() {
  return new NumberSchema('integer');
}

export function boolean() {
  return new BooleanSchema();
}

export function object() {
  return new ObjectSchema();
}

export function array() {
  return new ArraySchema();
}

export function nil() {
  return new NullSchema();
}

export { Schema } from './schemas/base';
