import 'mocha';
import assert = require('assert');
import { Schema } from '../src/schemas/base';

class SchemaImpl extends Schema<{}> {

  public constructor(type: string) {
    super(type);
  }

}

const RANDOM_STRING_1 = 'RANDOM_STRING_1';
const RANDOM_STRING_2 = 'RANDOM_STRING_2';

describe('Base schema test', () => {
  it('Should create simple object schema correctly', () => {
    const schema = new SchemaImpl('any');
    assert.deepEqual(schema.getJsonSchema(), { type: 'any'});
  })

  it('Should set, overwrite & remove id correctly', () => {
    let schema = new SchemaImpl('any');
    assert.deepEqual(schema.getJsonSchema(), { type: 'any'});
    schema = schema.id(RANDOM_STRING_1);
    assert.deepEqual(schema.getJsonSchema(), { type: 'any', id: RANDOM_STRING_1 });
    schema = schema.id(RANDOM_STRING_2);
    assert.deepEqual(schema.getJsonSchema(), { type: 'any', id: RANDOM_STRING_2 });
    schema = schema.id();
    assert.deepEqual(schema.getJsonSchema(), { type: 'any' });
  })

  it('Should set, overwrite & remove title correctly', () => {
    let schema = new SchemaImpl('any');
    assert.deepEqual(schema.getJsonSchema(), { type: 'any'});
    schema = schema.title(RANDOM_STRING_1);
    assert.deepEqual(schema.getJsonSchema(), { type: 'any', title: RANDOM_STRING_1 });
    schema = schema.title(RANDOM_STRING_2);
    assert.deepEqual(schema.getJsonSchema(), { type: 'any', title: RANDOM_STRING_2 });
    schema = schema.title();
    assert.deepEqual(schema.getJsonSchema(), { type: 'any' });
  })

  it('Should set, overwrite & remove description correctly', () => {
    let schema = new SchemaImpl('any');
    assert.deepEqual(schema.getJsonSchema(), { type: 'any'});
    schema = schema.description(RANDOM_STRING_1);
    assert.deepEqual(schema.getJsonSchema(), { type: 'any', description: RANDOM_STRING_1 });
    schema = schema.description(RANDOM_STRING_2);
    assert.deepEqual(schema.getJsonSchema(), { type: 'any', description: RANDOM_STRING_2 });
    schema = schema.description();
    assert.deepEqual(schema.getJsonSchema(), { type: 'any' });
  })

  it('Should set, overwrite & remove default correctly', () => {
    let schema = new SchemaImpl('any');
    assert.deepEqual(schema.getJsonSchema(), { type: 'any'});
    schema = schema.default(RANDOM_STRING_1);
    assert.deepEqual(schema.getJsonSchema(), { type: 'any', default: RANDOM_STRING_1 });
    schema = schema.default(RANDOM_STRING_2);
    assert.deepEqual(schema.getJsonSchema(), { type: 'any', default: RANDOM_STRING_2 });
    schema = schema.default();
    assert.deepEqual(schema.getJsonSchema(), { type: 'any' });
  })

  it('Should set, overwrite & remove exclusiveMaximum correctly', () => {
    let schema = new SchemaImpl('any');
    assert.deepEqual(schema.getJsonSchema(), { type: 'any'});
    schema = schema.exclusiveMaximum(false);
    assert.deepEqual(schema.getJsonSchema(), { type: 'any', exclusiveMaximum: false });
    schema = schema.exclusiveMaximum(true);
    assert.deepEqual(schema.getJsonSchema(), { type: 'any', exclusiveMaximum: true });
    schema = schema.exclusiveMaximum();
    assert.deepEqual(schema.getJsonSchema(), { type: 'any' });
  })

  it('Should set, overwrite & remove exclusiveMinimum correctly', () => {
    let schema = new SchemaImpl('any');
    assert.deepEqual(schema.getJsonSchema(), { type: 'any'});
    schema = schema.exclusiveMinimum(false);
    assert.deepEqual(schema.getJsonSchema(), { type: 'any', exclusiveMinimum: false });
    schema = schema.exclusiveMinimum(true);
    assert.deepEqual(schema.getJsonSchema(), { type: 'any', exclusiveMinimum: true });
    schema = schema.exclusiveMinimum();
    assert.deepEqual(schema.getJsonSchema(), { type: 'any' });
  })

  it('Should set, overwrite & remove enum correctly', () => {
    let schema = new SchemaImpl('any');
    assert.deepEqual(schema.getJsonSchema(), { type: 'any'});
    schema = schema.enum([RANDOM_STRING_1]);
    assert.deepEqual(schema.getJsonSchema(), { type: 'any', enum: [RANDOM_STRING_1] });
    schema = schema.enum([RANDOM_STRING_1, RANDOM_STRING_2]);
    assert.deepEqual(schema.getJsonSchema(), { type: 'any', enum: [RANDOM_STRING_1, RANDOM_STRING_2] });
    schema = schema.enum();
    assert.deepEqual(schema.getJsonSchema(), { type: 'any' });
  })
});
