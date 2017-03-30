import { mapObjIndexed, clone, memoize } from 'ramda'
import * as ajv from 'ajv'

import { Schema, SchemaProps } from './schemas/base'

export interface ValidateOptions {
  coerce: boolean
  removeAdditional: boolean
  useDefaults: boolean
}

export class ValidationError extends Error {

  public readonly errors: ajv.ErrorObject[]

  public readonly source: any

  constructor(source: any, errors: ajv.ErrorObject[]) {
    super('Validation Error')
    this.source = source
    this.errors = errors.filter(error => error.keyword !== '__type')
  }

}

const getAjvInstance = memoize<ajv.Ajv>(
  ({ coerce, useDefaults, removeAdditional }) => {
    const ajvInstance = new ajv({
      useDefaults,
      coerceTypes: coerce ? 'array' : false,
      removeAdditional,
    })

    ajvInstance.addKeyword(
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

    return ajvInstance
  },
)

function getRequiredProperties(props: SchemaProps<any>): string[] | undefined {
  const properties = props.properties
  if (!properties) {
    return undefined
  }

  const required = Object.keys(props.properties).filter((key: string) => {
    const property = properties[key]
    return !property.props.optional
  })

  return required.length ? required : undefined
}

function convertSchemaToAjvSchema(schema: Schema<any>): any {
  const { properties, items, allOf, anyOf, oneOf, type, ...copied } = schema.props

  return {
    ...copied,
    __type: type,
    properties: properties && mapObjIndexed((childSchema: Schema<any>) => {
      return convertSchemaToAjvSchema(childSchema)
    }, properties),
    items: items && convertSchemaToAjvSchema(items),
    allOf: allOf && allOf.map(convertSchemaToAjvSchema),
    anyOf: anyOf && anyOf.map(convertSchemaToAjvSchema),
    oneOf: oneOf && oneOf.map(convertSchemaToAjvSchema),
    required: getRequiredProperties(schema.props),
  }
}

export interface Validator<T> {

  validate(input: any): T

}

export function compile<T>(
  schema: Schema<T>,
  options: ValidateOptions = { coerce: false, useDefaults: false, removeAdditional: false }): Validator<T> {
  const ajv = getAjvInstance(options)
  const compiled = ajv.compile(convertSchemaToAjvSchema(schema))
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
