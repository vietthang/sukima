import { Schema, BaseSchema } from './schemas/base'
import { StringSchema } from './schemas/string'
import { NumberSchema } from './schemas/number'
import { ObjectSchema, PropertyDefinitions } from './schemas/object'
import { ArraySchema } from './schemas/array'

export function any() {
  return new BaseSchema<any, never, any, never>()
}

export function string() {
  return new StringSchema<never, string, never>()
}

export function number() {
  return new NumberSchema<never, number, never>()
}

export function integer() {
  return new NumberSchema<never, number, never>('integer')
}

export function boolean() {
  return new BaseSchema<boolean, never, boolean, never>({ type: 'boolean' })
}

export function object<T>(definitions: PropertyDefinitions<T>): ObjectSchema<T, never, T, never> {
  return new ObjectSchema<T, never, T, never>(definitions)
}

export function array<T>(schema?: Schema<T> | PropertyDefinitions<T>) {
  return new ArraySchema<T, never, T[], never>(schema)
}

export function nil() {
  return new BaseSchema<null, never, null, never>({ type: 'null' })
}

export function enumOf<T>(values: T[]) {
  return new BaseSchema<T, never, T, never>({ enum: values })
}

export { Schema, BaseSchema, PropertyMap } from './schemas/base';
export { StringSchema } from './schemas/string';
export { NumberSchema } from './schemas/number';
export { ObjectSchema } from './schemas/object';
export { ArraySchema } from './schemas/array';

export { validate, compile } from './validate';

export * from './operators'
