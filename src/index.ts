import { Schema } from './schemas/base'
import { StringSchema } from './schemas/string'
import { NumberSchema } from './schemas/number'
import { ObjectSchema, PropertyDefinitions } from './schemas/object'
import { ArraySchema } from './schemas/array'

export function any() {
  return new Schema<any>()
}

export function string() {
  return new StringSchema()
}

export function number() {
  return new NumberSchema()
}

export function integer() {
  return new NumberSchema('integer')
}

export function boolean() {
  return new Schema({ type: 'boolean' })
}

export function object<T>(definitions: PropertyDefinitions<T>) {
  return new ObjectSchema<T>(definitions)
}

export function array<T>(schema?: Schema<T> | PropertyDefinitions<T>) {
  return new ArraySchema<T>(schema)
}

export function nil() {
  return new Schema<null>({ type: 'null' })
}

export function enumOf<T>(values: T[]) {
  return new Schema<T>({ enum: values })
}

export { Schema, PropertyMap } from './schemas/base';
export { StringSchema } from './schemas/string';
export { NumberSchema } from './schemas/number';
export { ObjectSchema } from './schemas/object';
export { ArraySchema } from './schemas/array';

export { validate, compile, ValidationError, ValidateOptions } from './validate';

export * from './operators'
