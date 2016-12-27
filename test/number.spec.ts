import 'mocha';
import assert = require('assert');
import { NumberSchema } from '../src/schemas/number';

const RANDOM_NUMBER_1 = Math.random();
const RANDOM_NUMBER_2 = Math.random();

describe('Number schema test', () => {
  it('Should create simple number schema correctly', () => {
    const schema = new NumberSchema();
    assert.deepEqual(schema.getJsonSchema(), { type: 'number'});
  });

  it('Should create simple integer schema correctly', () => {
    const schema = new NumberSchema('integer');
    assert.deepEqual(schema.getJsonSchema(), { type: 'integer'});
  });

  it('Should set, overwrite & remove multipleOf correctly', () => {
    let schema = new NumberSchema();
    assert.deepEqual(schema.getJsonSchema(), { type: 'number' });
    schema = schema.multipleOf(RANDOM_NUMBER_1);
    assert.deepEqual(schema.getJsonSchema(), { type: 'number', multipleOf: RANDOM_NUMBER_1 });
    schema = schema.multipleOf(RANDOM_NUMBER_2);
    assert.deepEqual(schema.getJsonSchema(), { type: 'number', multipleOf: RANDOM_NUMBER_2 });
    schema = schema.multipleOf();
    assert.deepEqual(schema.getJsonSchema(), { type: 'number' });
  })

  it('Should set, overwrite & remove maximum correctly', () => {
    let schema = new NumberSchema();
    assert.deepEqual(schema.getJsonSchema(), { type: 'number'});
    schema = schema.maximum(RANDOM_NUMBER_1);
    assert.deepEqual(schema.getJsonSchema(), { type: 'number', maximum: RANDOM_NUMBER_1 });
    schema = schema.maximum(RANDOM_NUMBER_2);
    assert.deepEqual(schema.getJsonSchema(), { type: 'number', maximum: RANDOM_NUMBER_2 });
    schema = schema.maximum();
    assert.deepEqual(schema.getJsonSchema(), { type: 'number' });
  })

  it('Should set, overwrite & remove minimum correctly', () => {
    let schema = new NumberSchema();
    assert.deepEqual(schema.getJsonSchema(), { type: 'number'});
    schema = schema.minimum(RANDOM_NUMBER_1);
    assert.deepEqual(schema.getJsonSchema(), { type: 'number', minimum: RANDOM_NUMBER_1 });
    schema = schema.minimum(RANDOM_NUMBER_2);
    assert.deepEqual(schema.getJsonSchema(), { type: 'number', minimum: RANDOM_NUMBER_2 });
    schema = schema.minimum();
    assert.deepEqual(schema.getJsonSchema(), { type: 'number' });
  })

  it('Should interact with nullable & optional correctly', () => {
    const schema = new NumberSchema();
    assert.deepEqual(schema.getJsonSchema(), { type: 'number'});
    assert.deepEqual(schema.nullable().getJsonSchema(), { type: 'number', 'x-nullable': true });
    assert.deepEqual(schema.optional().getJsonSchema(), { type: 'number', 'x-optional': true });
    assert.deepEqual(
      schema.nullable().optional().getJsonSchema(),
      { type: 'number', 'x-optional': true, 'x-nullable': true },
    );
  });
});
