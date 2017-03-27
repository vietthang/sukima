import { mapObjIndexed, clone, memoize } from 'ramda'
import { Ajv, ErrorObject } from 'ajv'
import AJV = require('ajv')

import { Schema } from './schemas/base'
import { JsonSchema } from './jsonSchema'

export interface ValidateOptions {
  coerce: boolean
  removeAdditional: boolean
  useDefaults: boolean
}

export class ValidationError extends Error {

  public readonly errors: ErrorObject[]

  public readonly source: any

  constructor(source: any, errors: ErrorObject[]) {
    super('Validation Error')
    this.source = source
    this.errors = errors.filter(error => error.keyword !== '__type')
  }

}

const getAjvInstance = memoize<Ajv>(
  ({ coerce, useDefaults, removeAdditional }) => {
    const ajv = new AJV({
      useDefaults,
      coerceTypes: coerce ? 'array' : false,
      removeAdditional,
    })

    ajv.addKeyword(
      '__type',
      {
        macro(schema: any, parentSchema: any): any {
          if (parentSchema.nullable) {
            return {
              type: ['null', schema],
            }
          } else {
            return {
              type: schema,
            }
          }
        },
      },
    )

    return ajv
  },
)

function convertJsonSchemaToAjvSchema(jsonSchema: JsonSchema): any {
  const { properties, items, allOf, anyOf, oneOf, type, ...copied } = jsonSchema

  return {
    ...copied,
    __type: type,
    properties: properties && mapObjIndexed((childSchema: JsonSchema) => {
      return convertJsonSchemaToAjvSchema(childSchema)
    }, properties),
    items: items && convertJsonSchemaToAjvSchema(items),
    allOf: allOf && convertJsonSchemaToAjvSchema(allOf),
    anyOf: anyOf && convertJsonSchemaToAjvSchema(anyOf),
    oneOf: oneOf && convertJsonSchemaToAjvSchema(oneOf),
  }
}

export interface Validator<T> {

  validate(input: any): T

}

export function compile<T>(
  schema: Schema<T>,
  options: ValidateOptions = { coerce: false, useDefaults: false, removeAdditional: false }): Validator<T> {
  const ajv = getAjvInstance(options)
  const compiled = ajv.compile(convertJsonSchemaToAjvSchema(schema.toJsonSchema()))
  const isFiltering = options.coerce || options.useDefaults || options.removeAdditional

  return {
    validate: (input: any): T => {
      const validateValue = isFiltering ? clone(input) : input

      const result = compiled(validateValue)
      if (!result) {
        throw new ValidationError(validateValue, compiled.errors!)
      } else {
        return validateValue
      }
    },
  }
}

export function validate<T>(
  schema: Schema<T>,
  value: any,
  options: ValidateOptions = { coerce: false, useDefaults: false, removeAdditional: false },
) {
  return compile(schema, options).validate(value)
}
