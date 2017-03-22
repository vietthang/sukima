import { Schema } from './base'
import { ObjectSchema, PropertyDefinitions } from './object'

export class BaseArraySchema<T, U> extends Schema<T[] | U> {

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

  items<T1> (schema: Schema<T1> | PropertyDefinitions<T1>): BaseArraySchema<T1, U> {
    if (schema instanceof Schema) {
      return this.extend({ items: schema }) as BaseArraySchema<T1, U>
    } else if ('object' === typeof schema) {
      return this.items(new ObjectSchema().properties(schema)) as BaseArraySchema<T1, U>
    } else {
      throw new Error('Invalid type of items options.')
    }
  }

  nullable (): BaseArraySchema<T, U | null> {
    return super.nullable() as BaseArraySchema<T, U | null>
  }

  optional (): BaseArraySchema<T, U | undefined> {
    return super.optional() as BaseArraySchema<T, U | undefined>
  }

}

export class ArraySchema extends BaseArraySchema<any, never> {};
