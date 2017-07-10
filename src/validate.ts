import { mapValues, clone } from './utils'
import * as Ajv from 'ajv'
import { Success, Fail, Validation } from 'monet'

import { Schema, SchemaProps } from './schemas/base'

export interface ValidateOptions {
  coerce: boolean
  removeAdditional: boolean
  useDefaults: boolean
}

export class ValidationError extends Error {

  public readonly errors: Ajv.ErrorObject[]

  public readonly source: any

  constructor(source: any, errors: Ajv.ErrorObject[]) {
    super('Validation Error')
    this.source = source
    this.errors = errors.filter(error => error.keyword !== '__type')
  }

}

const getAjvInstance = ({ coerce, useDefaults, removeAdditional }: ValidateOptions) => {
  const ajv = new Ajv({
    allErrors: true,
    jsonPointers: true,
    format: 'full',
    unknownFormats: true,
    useDefaults,
    coerceTypes: coerce ? 'array' : false,
    removeAdditional: removeAdditional ? true : false,
  })

  require('ajv-errors')(ajv)

  return ajv
}

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
  const { additionalProperties, properties, items, allOf, anyOf, oneOf, type, nullable, ...copied } = schema.props

  return {
    ...copied,
    type: type && (nullable ? [ 'null', type ] : type),
    properties: properties && mapValues((childSchema: Schema<any>) => {
      return convertSchemaToAjvSchema(childSchema)
    }, properties),
    items: items && convertSchemaToAjvSchema(items),
    allOf: allOf && allOf.map(convertSchemaToAjvSchema),
    anyOf: anyOf && anyOf.map(convertSchemaToAjvSchema),
    oneOf: oneOf && oneOf.map(convertSchemaToAjvSchema),
    required: getRequiredProperties(schema.props),
    additionalProperties: !!additionalProperties,
  }
}

export interface Validator<T> {

  (input: any): Validation<ValidationError, T>

}

export function compile<T>(
  schema: Schema<T>,
  options: ValidateOptions = { coerce: false, useDefaults: false, removeAdditional: false },
): Validator<T> {
  const ajv = getAjvInstance(options)
  const compiled = ajv.compile(convertSchemaToAjvSchema(schema))

  return (input: any): Validation<ValidationError, T> => {
    const validateValue = clone(input)

    const result = compiled(validateValue)
    if (!result) {
      return Fail<ValidationError, T>(new ValidationError(input, compiled.errors!))
    } else {
      return Success<ValidationError, T>(validateValue)
    }
  }
}

export function validate<T>(
  schema: Schema<T>,
  value: any,
  options: ValidateOptions = { coerce: false, useDefaults: false, removeAdditional: false },
) {
  return compile(schema, options)(value)
}
