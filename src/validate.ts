import { mapObjIndexed, clone } from 'ramda'
import Ajv = require('ajv')

import { Schema } from './schemas/base'
import { JsonSchema } from './jsonSchema'
import { memoize } from './utils'

export interface ValidateOptions {
  convert: boolean
}

class ValidationError extends Error {

  public readonly errors: Ajv.ErrorObject[]

  public readonly source: any

  constructor (source: any, errors: Ajv.ErrorObject[]) {
    super('Validation Error')
    this.source = source
    this.errors = errors.filter(error => error.keyword !== '__type')
  }

}

class UnknownError extends Error {

  constructor () {
    super('Unknown Error')
  }

}

type AjvContainer = {
  compile: (schema: Object) => Ajv.ValidateFunction;
}

const getAjvInstance = memoize<boolean, AjvContainer>(
  (convert: boolean) => {
    const ajv = new Ajv({
      useDefaults: true,
      coerceTypes: convert ? 'array' : false,
    })

    ajv.addKeyword(
      '__type',
      {
        macro (schema: any, parentSchema: any): any {
          if (parentSchema['x-nullable']) {
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

    return {
      compile: memoize<any, Ajv.ValidateFunction>(
        (schema: Object) => ajv.compile(schema),
      ),
    }
  },
)

const convertSchemaToJsonSchema = memoize(
  (schema: Schema<any>): JsonSchema => schema.toJsonSchema(),
)

const convertJsonSchemaToAjvSchema = memoize(
  (jsonSchema: JsonSchema): any => {
    const { properties, items, type, ...copied } = jsonSchema

    return {
      ...copied,
      __type: type,
      properties: properties ? mapObjIndexed((childSchema: JsonSchema) => {
        return convertJsonSchemaToAjvSchema(childSchema)
      }, properties) : undefined,
      items: items ? convertJsonSchemaToAjvSchema(items) : undefined,
    }
  },
)

export function validate<T> (
  schema: Schema<T> | JsonSchema,
  value: any,
  options: ValidateOptions = { convert: false },
): T {
  if (schema instanceof Schema) {
    return validate<T>(convertSchemaToJsonSchema(schema), value, options)
  }
  const ajv = getAjvInstance(options.convert)
  const clonedValue = clone(value)
  const compiled = ajv.compile(convertJsonSchemaToAjvSchema(schema))
  const result = compiled(clonedValue)
  if (!result) {
    if (compiled.errors) {
      throw new ValidationError(clonedValue, compiled.errors)
    } else {
      throw new UnknownError()
    }
  } else {
    return clonedValue
  }
}

export async function validateAsync<T> (
  schema: Schema<T> | JsonSchema,
  value: any,
  options: ValidateOptions = { convert: false },
): Promise<T> {
  if (schema instanceof Schema) {
    return validateAsync<T>(convertSchemaToJsonSchema(schema), value, options)
  }
  const ajv = getAjvInstance(options.convert)
  const clonedValue = clone(value)
  const compiled = ajv.compile({
    ...convertJsonSchemaToAjvSchema(schema),
    $async: true,
  })
  const result = await compiled(clonedValue)
  if (!result) {
    if (compiled.errors) {
      throw new ValidationError(clonedValue, compiled.errors)
    } else {
      throw new UnknownError()
    }
  } else {
    return clonedValue
  }
}
