import { Maybe } from 'ramda-fantasy'

import { Schema, BaseSchema } from './base'
import { ObjectSchema, PropertyDefinitions } from './object'

function toSchema<T>(schema: Schema<T> | PropertyDefinitions<T> | undefined): Maybe<Schema<T>> {
  if (schema instanceof BaseSchema) {
    return Maybe.Just(schema)
  } else if (typeof schema === 'object') {
    return Maybe.Just(new ObjectSchema<any, never, any, never>(schema))
  } else {
    return Maybe.Nothing<Schema<T>>()
  }
}

export class ArraySchema<T, U, V, W> extends BaseSchema<T[], U, V, W> {

  /** @internal */
  constructor(schema?: Schema<T> | PropertyDefinitions<T>) {
    super(
      'array',
      Maybe.maybe(
        {},
        (schema) => ({
          items: schema,
        }),
        toSchema<T>(schema),
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
