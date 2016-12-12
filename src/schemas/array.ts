import { BaseSchema } from './base';

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

  items<T1, U1, V1>(items?: BaseSchema<T1, U1, V1>) {
    const newInstance = new ArraySchema<T1, U1, V1>();
    newInstance.schema = Object.assign(
      {},
      this.schema,
      {
        items: items ? items.getJsonSchema() : undefined,
      }
    );
    return newInstance;
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