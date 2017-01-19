import 'mocha';
import 'source-map-support/register';
import assert = require('assert');
import { ArraySchema } from '../src/schemas/array';
import { StringSchema } from '../src/schemas/string';
import { NumberSchema } from '../src/schemas/number';

const RANDOM_NUMBER_1 = Math.random();
const RANDOM_NUMBER_2 = Math.random();

describe('Array schema test', () => {
  it('Should create simple string schema correctly', () => {
    const schema = new ArraySchema();
    assert.deepEqual(schema.props, { type: 'array' });
  });

  it('Should set, overwrite & remove maxItems correctly', () => {
    let schema = new ArraySchema();
    assert.deepEqual(schema.props, { type: 'array' });
    schema = schema.maxItems(RANDOM_NUMBER_1);
    assert.deepEqual(schema.props, { type: 'array', maxItems: RANDOM_NUMBER_1 });
    schema = schema.maxItems(RANDOM_NUMBER_2);
    assert.deepEqual(schema.props, { type: 'array', maxItems: RANDOM_NUMBER_2 });
  });

  it('Should set, overwrite & remove minItems correctly', () => {
    let schema = new ArraySchema();
    assert.deepEqual(schema.props, { type: 'array' });
    schema = schema.minItems(RANDOM_NUMBER_1);
    assert.deepEqual(schema.props, { type: 'array', minItems: RANDOM_NUMBER_1 });
    schema = schema.minItems(RANDOM_NUMBER_2);
    assert.deepEqual(schema.props, { type: 'array', minItems: RANDOM_NUMBER_2 });
  });

  it('Should set, overwrite & remove uniqueItems correctly', () => {
    let schema = new ArraySchema();
    assert.deepEqual(schema.props, { type: 'array' });
    schema = schema.uniqueItems(false);
    assert.deepEqual(schema.props, { type: 'array' , uniqueItems: false });
    schema = schema.uniqueItems(true);
    assert.deepEqual(schema.props, { type: 'array' , uniqueItems: true });
  });

  it('Should set, overwrite & remove items correctly', () => {
    let schema = new ArraySchema();
    assert.deepEqual(schema.props, { type: 'array' });
    schema = schema.items(new StringSchema());
    assert.deepEqual(schema.props, { type: 'array' , items: { type: 'string' } });
    schema = schema.items({
      stringKey: new StringSchema(),
      objectKey: {
        numberKey: new NumberSchema(),
      },
    });
    assert.deepEqual(
      schema.props,
      {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            stringKey: {
              props: {
                type: 'string',
              },
            },
            objectKey: {
              props: {
                type: 'object',
                properties: {
                  numberKey: {
                    props: {
                      type: 'number',
                    },
                  },
                },
              }
            },
          },
        },
      },
    );
  });

  it('Should interact with nullable & optional correctly', () => {
    const schema = new ArraySchema();

    assert.deepEqual(
      schema.props,
      {
        type: 'array',
      },
    );

    assert.deepEqual(
      schema.nullable().props,
      {
        type: 'array',
        'nullable': true,
      },
    );

    assert.deepEqual(
      schema.optional().props,
      {
        type: 'array',
        'optional': true,
      },
    );

    assert.deepEqual(
      schema.nullable().optional().props,
      {
        type: 'array',
        'nullable': true,
        'optional': true,
      },
    );
  });
});
