/** @internal */
export type SchemaType = 'string' | 'number' | 'integer' | 'array' | 'object' | 'boolean' | 'null'

/** @internal */
export type PropertyMap<T> = {
  [K in keyof T]: Schema<T[K]>;
}

/** @internal */
export interface SchemaProps<T> {

  id?: string;

  title?: string;

  description?: string;

  'default'?: T;

  multipleOf?: number;

  maximum?: number;

  exclusiveMaximum?: boolean;

  minimum?: number;

  exclusiveMinimum?: boolean;

  maxLength?: number;

  minLength?: number;

  pattern?: string;

  additionalItems?: boolean;

  items?: Schema<any>;

  maxItems?: number;

  minItems?: number;

  uniqueItems?: boolean;

  maxProperties?: number;

  minProperties?: number;

  required?: string[];

  additionalProperties?: boolean;

  properties?: PropertyMap<T>;

  enum?: T[];

  type?: SchemaType;

  allOf?: Schema<any>[];

  anyOf?: Schema<any>[];

  oneOf?: Schema<any>[];

  not?: Schema<any>;

  format?: 'date-time' | 'email' | 'hostname' | 'ipv4' | 'ipv6' | 'uri' | string;

  nullable?: boolean;

  optional?: boolean;

  convert?: (input: any) => T;

}

export class Schema<T> {

  /** @internal */
  public readonly props: SchemaProps<T>;

  /** @internal */
  public constructor(type?: SchemaType) {
    this.props = { type: type };
  }

  /** @internal */
  public extend(properties?: Partial<SchemaProps<T>>): this {
    const cloned = Object.create(this.constructor.prototype);
    cloned.props = { ...this.props, ...properties };
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
    return this.extend({ not: schema });
  }

  nullable(): Schema<T | null> {
    return this.extend({ nullable: true });
  }

  optional(): Schema<T | undefined> {
    return this.extend({ optional: true });
  }

}
