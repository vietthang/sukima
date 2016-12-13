import { Schema, BaseSchema } from './base';
import { ObjectSchema, PropertyDefinitions } from './object';

export class ArraySchema<T, U, V> extends BaseSchema<T[], U, V> {

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

  items<T1>(items?: Schema<T1>): ArraySchema<T1, T1[], T1[]>;

  items<T1>(items?: PropertyDefinitions<T1>): ArraySchema<T1, T1[], T1[]>;

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

  nullable(): ArraySchema<T, null, V> {
    return this.extend({ 'x-nullable': true }) as ArraySchema<T, null, V>;
  }

  notNullable(): ArraySchema<T, T[], V> {
    return this.extend({ 'x-nullable': false }) as ArraySchema<T, T[], V>;
  }

  optional(): ArraySchema<T, U, undefined> {
    return this.extend({ 'x-optional': true }) as ArraySchema<T, U, undefined>;
  }

  required(): ArraySchema<T, U, T[]> {
    return this.extend({ 'x-optional': false }) as ArraySchema<T, U, T[]>;
  }

}