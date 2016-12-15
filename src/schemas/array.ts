import { Schema, BaseSchema } from './base';
import { ObjectSchema, PropertyDefinitions } from './object';

export class BaseArraySchema<T, U, V> extends BaseSchema<T[], U, V> {

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

  items<T1>(items?: Schema<T1>): BaseArraySchema<T1, T1[], T1[]>;

  items<T1>(items?: PropertyDefinitions<T1>): BaseArraySchema<T1, T1[], T1[]>;

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

  nullable(): BaseArraySchema<T, null, V> {
    return super.nullable() as BaseArraySchema<T, null, V>;
  }

  notNullable(): BaseArraySchema<T, T[], V> {
    return super.notNullable() as BaseArraySchema<T, T[], V>;
  }

  optional(): BaseArraySchema<T, U, undefined> {
    return super.optional() as BaseArraySchema<T, U, undefined>;
  }

  required(): BaseArraySchema<T, U, T[]> {
    return super.required() as BaseArraySchema<T, U, T[]>;
  }

}

export class ArraySchema extends BaseArraySchema<any, any, any> {};
