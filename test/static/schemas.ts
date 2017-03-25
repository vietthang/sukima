import { Schema } from '../../src/schemas/base'

import { string, number } from '../../src'
import { nullable } from '../../src/operators'

function validateMock<T> (schema: Schema<T>): T {
  return null as any as T
}

export const testString = validateMock(string())

export const testStringWithOptional = validateMock(string().optional())

export const testStringWithDefaultIsAString = validateMock(string().default('a'))

export const testStringWithDefaultIsANumber = validateMock(string().default(1))

export const testStringWithDefaultIsNull = validateMock(string().default(null))

export const testNullableString = validateMock(nullable(string()))

export const testNumber = validateMock(number())

export const testNumberWithOptional = validateMock(number().optional())

export const testNullableNumber = validateMock(nullable(number()))
