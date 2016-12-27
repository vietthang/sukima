import 'mocha';
import 'source-map-support/register';
import assert = require('assert');
import { ArraySchema } from '../src/schemas/array';
import { StringSchema } from '../src/schemas/string';
import { NumberSchema } from '../src/schemas/number';

const RANDOM_NUMBER_1 = Math.random();
const RANDOM_NUMBER_2 = Math.random();

describe('String schema test', () => {
  it('Should create simple string schema correctly', () => {
    const schema = new ArraySchema();
    assert.deepEqual(schema.getJsonSchema(), { type: 'array' });
  });

  it('Should set, overwrite & remove maxItems correctly', () => {
    let schema = new ArraySchema();
    assert.deepEqual(schema.getJsonSchema(), { type: 'array' });
    schema = schema.maxItems(RANDOM_NUMBER_1);
    assert.deepEqual(schema.getJsonSchema(), { type: 'array', maxItems: RANDOM_NUMBER_1 });
    schema = schema.maxItems(RANDOM_NUMBER_2);
    assert.deepEqual(schema.getJsonSchema(), { type: 'array', maxItems: RANDOM_NUMBER_2 });
    schema = schema.maxItems();
    assert.deepEqual(schema.getJsonSchema(), { type: 'array' });
  })

  it('Should set, overwrite & remove minItems correctly', () => {
    let schema = new ArraySchema();
    assert.deepEqual(schema.getJsonSchema(), { type: 'array' });
    schema = schema.minItems(RANDOM_NUMBER_1);
    assert.deepEqual(schema.getJsonSchema(), { type: 'array', minItems: RANDOM_NUMBER_1 });
    schema = schema.minItems(RANDOM_NUMBER_2);
    assert.deepEqual(schema.getJsonSchema(), { type: 'array', minItems: RANDOM_NUMBER_2 });
    schema = schema.minItems();
    assert.deepEqual(schema.getJsonSchema(), { type: 'array' });
  })

  it('Should set, overwrite & remove uniqueItems correctly', () => {
    let schema = new ArraySchema();
    assert.deepEqual(schema.getJsonSchema(), { type: 'array' });
    schema = schema.uniqueItems(false);
    assert.deepEqual(schema.getJsonSchema(), { type: 'array' , uniqueItems: false });
    schema = schema.uniqueItems(true);
    assert.deepEqual(schema.getJsonSchema(), { type: 'array' , uniqueItems: true });
    schema = schema.uniqueItems();
    assert.deepEqual(schema.getJsonSchema(), { type: 'array' });
  })

  it('Should set, overwrite & remove items correctly', () => {
    let schema = new ArraySchema();
    assert.deepEqual(schema.getJsonSchema(), { type: 'array' });
    schema = schema.items(new StringSchema());
    assert.deepEqual(schema.getJsonSchema(), { type: 'array' , items: { type: 'string' } });
    schema = schema.items({
      stringKey: new StringSchema(),
      objectKey: {
        numberKey: new NumberSchema(),
      },
    });
    assert.deepEqual(
      schema.getJsonSchema(),
      {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            stringKey: {
              type: 'string',
            },
            objectKey: {
              type: 'object',
              properties: {
                numberKey: {
                  type: 'number',
                },
              },
              required: [ 'numberKey' ],
            },
          },
          required: [ 'stringKey', 'objectKey' ],
        },
      },
    );
    schema = schema.items();
    assert.deepEqual(schema.getJsonSchema(), { type: 'array' });
  })

  it('Should interact with nullable & optional correctly', () => {
    const schema = new ArraySchema();
    assert.deepEqual(schema.getJsonSchema(), { type: 'array'});
    assert.deepEqual(schema.nullable().getJsonSchema(), { type: 'array', 'x-nullable': true });
    assert.deepEqual(schema.optional().getJsonSchema(), { type: 'array', 'x-optional': true });
    assert.deepEqual(
      schema.nullable().optional().getJsonSchema(),
      { type: 'array', 'x-optional': true, 'x-nullable': true },
    );
  });
});
