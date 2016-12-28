import { Schema } from './schemas/base';

export function allOf<T0, T1>(
  schema0: Schema<T0>,
  schema1: Schema<T1>,
): Schema<T0 & T1>;

export function allOf<T0, T1, T2>(
  schema0: Schema<T0>,
  schema1: Schema<T1>,
  schema2: Schema<T2>,
): Schema<T0 & T1 & T2>;

export function allOf<T0, T1, T2, T3>(
  schema0: Schema<T0>,
  schema1: Schema<T1>,
  schema2: Schema<T2>,
  schema3: Schema<T3>,
): Schema<T0 & T1 & T2 & T3>;

export function allOf<T0, T1, T2, T3, T4>(
  schema0: Schema<T0>,
  schema1: Schema<T1>,
  schema2: Schema<T2>,
  schema3: Schema<T3>,
  schema4: Schema<T4>,
): Schema<T0 & T1 & T2 & T3 & T4>;

export function allOf(...schemas: any[]): any {
  return new Schema().extend({
    allOf: schemas.map(schema => schema.getJsonSchema()),
  });
};

export function anyOf<T0, T1>(
  schema0: Schema<T0>,
  schema1: Schema<T1>,
): Schema<T0 | T1>;

export function anyOf<T0, T1, T2>(
  schema0: Schema<T0>,
  schema1: Schema<T1>,
  schema2: Schema<T2>,
): Schema<T0 | T1 | T2>;

export function anyOf<T0, T1, T2, T3>(
  schema0: Schema<T0>,
  schema1: Schema<T1>,
  schema2: Schema<T2>,
  schema3: Schema<T3>,
): Schema<T0 | T1 | T2 | T3>;

export function anyOf<T0, T1, T2, T3, T4>(
  schema0: Schema<T0>,
  schema1: Schema<T1>,
  schema2: Schema<T2>,
  schema3: Schema<T3>,
  schema4: Schema<T4>,
): Schema<T0 | T1 | T2 | T3 | T4>;

export function anyOf(...schemas: any[]): any {
  return new Schema().extend({
    anyOf: schemas.map(schema => schema.getJsonSchema()),
  });
};

export function oneOf<T0, T1>(
  schema0: Schema<T0>,
  schema1: Schema<T1>,
): Schema<T0 | T1>;

export function oneOf<T0, T1, T2>(
  schema0: Schema<T0>,
  schema1: Schema<T1>,
  schema2: Schema<T2>,
): Schema<T0 | T1 | T2>;

export function oneOf<T0, T1, T2, T3>(
  schema0: Schema<T0>,
  schema1: Schema<T1>,
  schema2: Schema<T2>,
  schema3: Schema<T3>,
): Schema<T0 | T1 | T2 | T3>;

export function oneOf<T0, T1, T2, T3, T4>(
  schema0: Schema<T0>,
  schema1: Schema<T1>,
  schema2: Schema<T2>,
  schema3: Schema<T3>,
  schema4: Schema<T4>,
): Schema<T0 | T1 | T2 | T3 | T4>;

export function oneOf(...schemas: any[]): any {
  return new Schema().extend({
    oneOf: schemas.map(schema => schema.getJsonSchema()),
  });
};
