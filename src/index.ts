import { BaseSchema } from './schemas/base'
import { StringSchema } from './schemas/string'
import { NumberSchema } from './schemas/number'
import { ObjectSchema, PropertyDefinitions } from './schemas/object'
import { ArraySchema } from './schemas/array'

export function any () {
  return new BaseSchema<any, never, any>()
}

export function string () {
  return new StringSchema<never, string>()
}

export function number () {
  return new NumberSchema<never, number>()
}

export function integer () {
  return new NumberSchema<never, number>('integer')
}

export function boolean () {
  return new BaseSchema<boolean, never, boolean>('boolean')
}

export function object (): ObjectSchema<object, never, object>

export function object<T extends object> (definitions: PropertyDefinitions<T>): ObjectSchema<T, never, T>

export function object (properties?: any): any {
  const schema = new ObjectSchema()
  if (properties) {
    return schema.properties(properties)
  } else {
    return schema
  }
}

export function array () {
  return new ArraySchema<any, never, any[]>()
}

export function nil () {
  return new BaseSchema<null, never, null>('null')
}

export { Schema, BaseSchema } from './schemas/base';
export { StringSchema } from './schemas/string';
export { NumberSchema } from './schemas/number';
export { ObjectSchema } from './schemas/object';
export { ArraySchema } from './schemas/array';

export { validate } from './validate';

export * from './operators'
