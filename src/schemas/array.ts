import { Schema, BaseSchema } from './base'
import { ObjectSchema, PropertyDefinitions } from './object'

export class ArraySchema<T, U, V, W> extends BaseSchema<T[], U, V, W> {

  /** @internal */
  constructor() {
    super('array')
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

  items<T1>(schema: Schema<T1> | PropertyDefinitions<T1>): ArraySchema<T1, U, V, W> {
    if (schema instanceof BaseSchema) {
      return this.extend({ items: schema }) as any as ArraySchema<T1, U, V, W>
    } else {
      return this.items(new ObjectSchema(schema)) as any as ArraySchema<T1, U, V, W>
    }
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
