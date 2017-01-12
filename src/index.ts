import { Schema } from './schemas/base';
import { StringSchema } from './schemas/string';
import { NumberSchema } from './schemas/number';
import { ObjectSchema, Empty, PropertyDefinitions } from './schemas/object';
import { ArraySchema } from './schemas/array';

export function any() {
  return new Schema<any>();
}

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
  return new Schema('boolean');
}

export function object(): ObjectSchema<Empty>;

export function object<T>(definitions: PropertyDefinitions<T>): ObjectSchema<T>;

export function object(properties?: any): any {
  const schema = new ObjectSchema()
  if (properties) {
    return schema.properties(properties);
  } else {
    return schema;
  }
}

export function array() {
  return new ArraySchema();
}

export function nil() {
  return new Schema('null');
}

export { Schema } from './schemas/base';

export { JsonSchema } from './jsonSchema';

export { validate, validateAsync } from './validate';
