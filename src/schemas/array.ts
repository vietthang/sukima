import { Schema } from './base'
import { ObjectSchema, PropertyDefinitions } from './object'

function toSchema<T>(schema?: Schema<T> | PropertyDefinitions<T>): Schema<T> | undefined {
  if (schema instanceof Schema) {
    return schema
  }

  if (typeof schema === 'object') {
    return new ObjectSchema(schema as PropertyDefinitions<T>)
  }

  if (schema === undefined) {
    return undefined
  }

  throw new Error('Invalid type of definition')
}

export class ArraySchema<T> extends Schema<T[]> {

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

}
