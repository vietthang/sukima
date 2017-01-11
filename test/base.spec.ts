import 'mocha';
import assert = require('assert');
import { Schema, SchemaType } from '../src/schemas/base';

class SchemaImpl extends Schema<any> {

  public constructor(__type: SchemaType) {
    super(__type);
  }

}

const RANDOM_STRING_1 = 'RANDOM_STRING_1';
const RANDOM_STRING_2 = 'RANDOM_STRING_2';

describe('Base schema test', () => {
  it('Should create simple object schema correctly', () => {
    const schema = new SchemaImpl('object');
    assert.deepEqual(schema.schema, { __type: 'object'});
  });

  it('Should set, overwrite & remove id correctly', () => {
    let schema = new SchemaImpl('object');
    assert.deepEqual(schema.schema, { __type: 'object'});
    schema = schema.id(RANDOM_STRING_1);
    assert.deepEqual(schema.schema, { __type: 'object', id: RANDOM_STRING_1 });
    schema = schema.id(RANDOM_STRING_2);
    assert.deepEqual(schema.schema, { __type: 'object', id: RANDOM_STRING_2 });
  });

  it('Should set, overwrite & remove title correctly', () => {
    let schema = new SchemaImpl('object');
    assert.deepEqual(schema.schema, { __type: 'object'});
    schema = schema.title(RANDOM_STRING_1);
    assert.deepEqual(schema.schema, { __type: 'object', title: RANDOM_STRING_1 });
    schema = schema.title(RANDOM_STRING_2);
    assert.deepEqual(schema.schema, { __type: 'object', title: RANDOM_STRING_2 });
  });

  it('Should set, overwrite & remove description correctly', () => {
    let schema = new SchemaImpl('object');
    assert.deepEqual(schema.schema, { __type: 'object'});
    schema = schema.description(RANDOM_STRING_1);
    assert.deepEqual(schema.schema, { __type: 'object', description: RANDOM_STRING_1 });
    schema = schema.description(RANDOM_STRING_2);
    assert.deepEqual(schema.schema, { __type: 'object', description: RANDOM_STRING_2 });
  });

  it('Should set, overwrite & remove default correctly', () => {
    let schema = new SchemaImpl('object');
    assert.deepEqual(schema.schema, { __type: 'object'});
    schema = schema.default(RANDOM_STRING_1);
    assert.deepEqual(schema.schema, { __type: 'object', default: RANDOM_STRING_1 });
    schema = schema.default(RANDOM_STRING_2);
    assert.deepEqual(schema.schema, { __type: 'object', default: RANDOM_STRING_2 });
  });

  it('Should set, overwrite & remove exclusiveMaximum correctly', () => {
    let schema = new SchemaImpl('object');
    assert.deepEqual(schema.schema, { __type: 'object'});
    schema = schema.exclusiveMaximum(false);
    assert.deepEqual(schema.schema, { __type: 'object', exclusiveMaximum: false });
    schema = schema.exclusiveMaximum(true);
    assert.deepEqual(schema.schema, { __type: 'object', exclusiveMaximum: true });
  });

  it('Should set, overwrite & remove exclusiveMinimum correctly', () => {
    let schema = new SchemaImpl('object');
    assert.deepEqual(schema.schema, { __type: 'object'});
    schema = schema.exclusiveMinimum(false);
    assert.deepEqual(schema.schema, { __type: 'object', exclusiveMinimum: false });
    schema = schema.exclusiveMinimum(true);
    assert.deepEqual(schema.schema, { __type: 'object', exclusiveMinimum: true });
  });

  it('Should set, overwrite & remove enum correctly', () => {
    let schema = new SchemaImpl('object');
    assert.deepEqual(schema.schema, { __type: 'object'});
    schema = schema.enum([RANDOM_STRING_1]);
    assert.deepEqual(schema.schema, { __type: 'object', enum: [RANDOM_STRING_1] });
    schema = schema.enum([RANDOM_STRING_1, RANDOM_STRING_2]);
    assert.deepEqual(schema.schema, { __type: 'object', enum: [RANDOM_STRING_1, RANDOM_STRING_2] });
  });
});
