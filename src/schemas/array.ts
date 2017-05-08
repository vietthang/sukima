import { Schema, BaseSchema } from './base'
import { ObjectSchema, PropertyDefinitions } from './object'

function toSchema<T>(schema?: Schema<T> | PropertyDefinitions<T>): Schema<T> | undefined {
  if (schema instanceof BaseSchema) {
    return schema
  }

  if (typeof schema === 'object') {
    return new ObjectSchema<any, never, any, never>(schema)
  }

  if (schema === undefined) {
    return undefined
  }

  throw new Error('Invalid type of definition')
}

export class ArraySchema<T, U, V, W> extends BaseSchema<T[], U, V, W> {

  /** @internal */
  constructor(schema?: Schema<T> | PropertyDefinitions<T>) {
    super(
      Object.assign(
        {},
        schema ? { items: toSchema(schema) } : {},
        { type: 'array' } as any,
      ),
    )
  }

  maxItems(maxItems: number) {
    return this.extend({ maxItems })
  }

  minItems(minItems: number) {
    return this.extend({ minItems })
  }

  uniqueItems(uniqueItems: boolean) {
    return this.extend({ uniqueItems })
  }

  default(defaultValue: T[]): ArraySchema<T, T[], T[], W> {
    return this.extend({ default: defaultValue }) as ArraySchema<T, T[], T[], W>
  }

  nullable(): ArraySchema<T, U, V, null> {
    return this.extend({ nullable: true }) as ArraySchema<T, U, V, null>
  }

  optional(): ArraySchema<T, U, U | undefined, W> {
    return this.extend({ optional: true })
  }

}
