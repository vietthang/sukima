import { Schema } from './base';

export class ArraySchema<T> extends Schema<T[]> {

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

  items<U>(items?: Schema<U>) {
    const newInstance = new ArraySchema<U>();
    newInstance.schema = Object.assign(
      {},
      this.schema,
      {
        items: items ? items.getJsonSchema() : undefined,
      }
    );
    return newInstance;
  }

}