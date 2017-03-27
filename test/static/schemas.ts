import { Schema } from '../../src/schemas/base'

import { array, string, number, object } from '../../src'
import { nullable } from '../../src/operators'

function validateMock<T>(schema: Schema<T>): T {
  return null as any as T
}

export const testString = validateMock(string())

export const testStringWithOptional = validateMock(string().optional())

export const testStringWithDefaultIsAString = validateMock(string().default('a'))

export const testNullableString = validateMock(nullable(string()))

export const testNumber = validateMock(number())

export const testNumberWithOptional = validateMock(number().optional())

export const testNullableNumber = validateMock(nullable(number()))

export const testArray = validateMock(array())

export const testStringArray = validateMock(array(string()))

export const testNumberArray = validateMock(array(number()))

export const testObjectArray = validateMock(array(object({
  foo: string(),
  bar: number(),
})))

export const testRawObjectArray = validateMock(array({
  foo: string(),
  bar: number(),
}))

export const testNestedObjectArray = validateMock(array({
  foo: string(),
  bar: number(),
  items: array({
    fooz: number(),
  }),
}))
