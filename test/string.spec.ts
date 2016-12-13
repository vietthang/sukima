import 'mocha';
import assert = require('assert');
import { StringSchema } from '../src/schemas/string';

class SchemaImpl extends StringSchema<string, string> {}

const RANDOM_STRING_1 = Math.random().toLocaleString();
const RANDOM_STRING_2 = Math.random().toLocaleString();
const RANDOM_NUMBER_1 = Math.random();
const RANDOM_NUMBER_2 = Math.random();

describe('String schema test', () => {
  it('Should create simple string schema correctly', () => {
    const schema = new SchemaImpl();
    assert.deepEqual(schema.getJsonSchema(), { type: 'string'});
  });

  it('Should set, overwrite & remove format correctly', () => {
    let schema = new SchemaImpl();
    assert.deepEqual(schema.getJsonSchema(), { type: 'string' });
    schema = schema.format(RANDOM_STRING_1);
    assert.deepEqual(schema.getJsonSchema(), { type: 'string', format: RANDOM_STRING_1 });
    schema = schema.format(RANDOM_STRING_2);
    assert.deepEqual(schema.getJsonSchema(), { type: 'string', format: RANDOM_STRING_2 });
    schema = schema.format();
    assert.deepEqual(schema.getJsonSchema(), { type: 'string' });
  })

  it('Should set, overwrite & remove maxLength correctly', () => {
    let schema = new SchemaImpl();
    assert.deepEqual(schema.getJsonSchema(), { type: 'string' });
    schema = schema.maxLength(RANDOM_NUMBER_1);
    assert.deepEqual(schema.getJsonSchema(), { type: 'string', maxLength: RANDOM_NUMBER_1 });
    schema = schema.maxLength(RANDOM_NUMBER_2);
    assert.deepEqual(schema.getJsonSchema(), { type: 'string', maxLength: RANDOM_NUMBER_2 });
    schema = schema.maxLength();
    assert.deepEqual(schema.getJsonSchema(), { type: 'string' });
  })

  it('Should set, overwrite & remove minLength correctly', () => {
    let schema = new SchemaImpl();
    assert.deepEqual(schema.getJsonSchema(), { type: 'string' });
    schema = schema.minLength(RANDOM_NUMBER_1);
    assert.deepEqual(schema.getJsonSchema(), { type: 'string' , minLength: RANDOM_NUMBER_1 });
    schema = schema.minLength(RANDOM_NUMBER_2);
    assert.deepEqual(schema.getJsonSchema(), { type: 'string' , minLength: RANDOM_NUMBER_2 });
    schema = schema.minLength();
    assert.deepEqual(schema.getJsonSchema(), { type: 'string' });
  })

  it('Should set, overwrite & remove pattern correctly', () => {
    let schema = new SchemaImpl();
    assert.deepEqual(schema.getJsonSchema(), { type: 'string' });
    schema = schema.pattern(RANDOM_STRING_1);
    assert.deepEqual(schema.getJsonSchema(), { type: 'string' , pattern: RANDOM_STRING_1 });
    schema = schema.pattern(new RegExp(RANDOM_STRING_2));
    assert.deepEqual(schema.getJsonSchema(), { type: 'string' , pattern: `/${RANDOM_STRING_2}/` });
    schema = schema.pattern();
    assert.deepEqual(schema.getJsonSchema(), { type: 'string' });
  })

  it('Should interact with nullable & optional correctly', () => {
    const schema = new SchemaImpl();
    assert.deepEqual(schema.getJsonSchema(), { type: 'string'});
    assert.deepEqual(schema.nullable().getJsonSchema(), { type: 'string', 'x-nullable': true });
    assert.deepEqual(schema.nullable().notNullable().getJsonSchema(), { type: 'string', 'x-nullable': false });
    assert.deepEqual(schema.notNullable().getJsonSchema(), { type: 'string', 'x-nullable': false });
    assert.deepEqual(schema.optional().getJsonSchema(), { type: 'string', 'x-optional': true });
    assert.deepEqual(schema.required().getJsonSchema(), { type: 'string', 'x-optional': false });
    assert.deepEqual(
      schema.nullable().optional().getJsonSchema(),
      { type: 'string', 'x-optional': true, 'x-nullable': true },
    );
  });
});
