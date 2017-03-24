import { Schema, BaseSchema } from './base'
import { ObjectSchema, PropertyDefinitions } from './object'

export class ArraySchema<T, U, V> extends BaseSchema<T[], U, V> {

  /** @internal */
  constructor () {
    super('array')
  }

  maxItems (maxItems: number) {
    return this.extend({ maxItems })
  }

  minItems (minItems: number) {
    return this.extend({ minItems })
  }

  uniqueItems (uniqueItems: boolean) {
    return this.extend({ uniqueItems })
  }

  items<T1> (schema: Schema<T1> | PropertyDefinitions<T1>): ArraySchema<T1, U, V> {
    if (schema instanceof BaseSchema) {
      return this.extend({ items: schema }) as any as ArraySchema<T1, U, V>
    } else {
      return this.items(new ObjectSchema().properties(schema)) as any as ArraySchema<T1, U, V>
    }
  }

}
