import { JsonSchema, JsonSchemaTypes } from './jsonSchema';

export abstract class Schema<T> {

  public value = {} as T;

  protected schema: JsonSchema;

  protected internal: any;

  protected constructor(type: JsonSchemaTypes) {
    this.schema = { type };
    this.internal = {};
  }

  protected extend(properties?: Partial<JsonSchema>, internal?: any): this {
    const cloned = Object.create(this.constructor.prototype);
    cloned.schema = { ...this.schema, ...properties };
    cloned.internal = { ...this.internal, ...internal };
    return cloned;
  }

  getJsonSchema() {
    return this.schema;
  }

  id(id?: string) {
    return this.extend({ id });
  }

  title(title?: string) {
    return this.extend({ title });
  }

  description(description?: string) {
    return this.extend({ description });
  }

  default(defaultValue?: T) {
    return this.extend({ default: defaultValue });
  }

  exclusiveMaximum(exclusiveMaximum?: boolean) {
    return this.extend({ exclusiveMaximum });
  }

  enum(values?: T[]) {
    return this.extend({ enum: values });
  }

  not<U>(schema?: Schema<U>) {
    return this.extend({ not: schema ? schema.getJsonSchema() : undefined });
  }

  allOf(schemas?: Schema<T>[]) {
    return this.extend({ allOf: schemas ? schemas.map(subSchema => subSchema.getJsonSchema()) : undefined });
  }

  anyOf(schemas?: Schema<T>[]) {
    return this.extend({ anyOf: schemas ? schemas.map(subSchema => subSchema.getJsonSchema()) : undefined });
  }

  oneOf(schemas?: Schema<T>[]) {
    return this.extend({ oneOf: schemas ? schemas.map(subSchema => subSchema.getJsonSchema()) : undefined });
  }

}
