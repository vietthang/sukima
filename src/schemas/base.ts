import { JsonSchema } from '../jsonSchema';

export type SchemaType = 'string' | 'number' | 'integer' | 'array' | 'object' | 'boolean' | 'null'

export interface InternalJsonSchema extends JsonSchema {

  __type?: SchemaType;

  'x-nullable'?: boolean;

  'x-optional'?: boolean;

}

export class Schema<T> {

  public readonly schema: InternalJsonSchema;

  public constructor(type?: SchemaType) {
    this.schema = { __type: type };
  }

  public extend(properties?: Partial<InternalJsonSchema>): this {
    const cloned = Object.create(this.constructor.prototype);
    cloned.schema = { ...this.schema, ...properties };
    return cloned;
  }

  id(id: string) {
    return this.extend({ id });
  }

  title(title: string) {
    return this.extend({ title });
  }

  description(description: string) {
    return this.extend({ description });
  }

  default(defaultValue: T) {
    return this.extend({ default: defaultValue });
  }

  exclusiveMaximum(exclusiveMaximum: boolean) {
    return this.extend({ exclusiveMaximum });
  }

  exclusiveMinimum(exclusiveMinimum: boolean) {
    return this.extend({ exclusiveMinimum });
  }

  enum(values: T[]) {
    return this.extend({ enum: values });
  }

  not<U>(schema: Schema<U>) {
    return this.extend({ not: schema ? schema.schema : undefined });
  }

  getPropertySchema<K extends keyof T>(key: K): Schema<T[K]> {
    if (Array.isArray(this.schema.__type)) {
      throw new Error('JSON schema with type is an array is not supported.');
    }
    if (!this.schema.__type) {
      throw new Error('JSON schema does not contain type.');
    }
    if (!this.schema.properties) {
      throw new Error('JSON schema does not contain properties.');
    }
    if (!this.schema.properties[key]) {
      throw new Error(`JSON schema does not contain key ${key}`);
    }
    return new Schema<T[K]>(this.schema.__type).extend(this.schema.properties[key]);
  }

  getPartialSchema(): Schema<Partial<T>> {
    return this.extend({ required: undefined }) as Schema<Partial<T>>;
  }

  nullable(): Schema<T | null> {
    return this.extend({ 'x-nullable': true }) as Schema<T | null>;
  }

  optional(): Schema<T | undefined> {
    return this.extend({ 'x-optional': true }) as Schema<T | undefined>;
  }

}
