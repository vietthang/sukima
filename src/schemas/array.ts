import { Schema } from './base'
import { ObjectSchema, PropertyDefinitions } from './object'

function toSchema<T>(schema: Schema<T> | PropertyDefinitions<T>): Schema<T> {
  if (schema instanceof Schema) {
    return schema
  }

  return new ObjectSchema(schema as PropertyDefinitions<T>)
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
