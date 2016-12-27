import { Schema } from './base';
import { ObjectSchema, PropertyDefinitions } from './object';

export class BaseArraySchema<T, U> extends Schema<T[] | U> {

  constructor() {
    super('array');
  }

  maxItems(maxItems?: number) {
    return this.extend({ maxItems });
  }

  minItems(minItems?: number) {
    return this.extend({ minItems });
  }

  uniqueItems(uniqueItems?: boolean) {
    return this.extend({ uniqueItems });
  }

  items<T1>(items?: Schema<T1>): BaseArraySchema<T1, U>;

  items<T1>(items?: PropertyDefinitions<T1>): BaseArraySchema<T1, U>;

  items(items: any) {
    if (items === undefined) {
      return this.extend({ items: undefined });
    } else if (items instanceof Schema) {
      return this.extend({ items: items.getJsonSchema() });
    } else if ('object' === typeof items) {
      return this.items(new ObjectSchema().properties(items));
    } else {
      throw new Error('Invalid type of items options.');
    }
  }

  nullable(): BaseArraySchema<T, U | null> {
    return super.nullable() as BaseArraySchema<T, U | null>;
  }

  optional(): BaseArraySchema<T, U | undefined> {
    return super.optional() as BaseArraySchema<T, U | undefined>;
  }

}

export class ArraySchema extends BaseArraySchema<any, never> {};
