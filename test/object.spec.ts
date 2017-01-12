import 'mocha';
import assert = require('assert');
import { string, number } from '../src';
import { ObjectSchema, Empty } from '../src/schemas/object';

const RANDOM_NUMBER_1 = Math.random();
const RANDOM_NUMBER_2 = Math.random();

describe('Object schema test', () => {
  it('Should create simple object schema correctly', () => {
    const schema = new ObjectSchema();
    assert.deepEqual(schema.schema, { __type: 'object'});
  });

  it('Should set, overwrite & remove minProperties correctly', () => {
    let schema = new ObjectSchema();
    assert.deepEqual(schema.schema, { __type: 'object' });
    assert.deepEqual(
      schema.minProperties(RANDOM_NUMBER_1).schema,
      { __type: 'object', minProperties: RANDOM_NUMBER_1 },
    );
    assert.deepEqual(
      schema.minProperties(RANDOM_NUMBER_2).schema,
      { __type: 'object', minProperties: RANDOM_NUMBER_2 },
    );
  });

  it('Should set, overwrite & remove maxProperties correctly', () => {
    let schema = new ObjectSchema();
    assert.deepEqual(schema.schema, { __type: 'object' });
    assert.deepEqual(
      schema.maxProperties(RANDOM_NUMBER_1).schema,
      { __type: 'object', maxProperties: RANDOM_NUMBER_1 },
    );
    assert.deepEqual(
      schema.maxProperties(RANDOM_NUMBER_2).schema,
      { __type: 'object', maxProperties: RANDOM_NUMBER_2 },
    );
  });

  it('Should set properties correctly', () => {
    let schema = new ObjectSchema<Empty>();
    assert.deepEqual(schema.schema, { __type: 'object' });
    schema = schema.properties({
      foo: string(),
      bar: number(),
    });
    assert.deepEqual(
      schema.schema,
      {
        __type: 'object',
        properties: {
          foo: {
            __type: 'string',
          },
          bar: {
            __type: 'number',
          },
        },
        required: ['foo', 'bar'],
      },
    );
    schema = schema.properties({
      foo2: string(),
      bar2: number(),
    })
    assert.deepEqual(
      schema.schema,
      {
        __type: 'object',
        properties: {
          foo2: {
            __type: 'string',
          },
          bar2: {
            __type: 'number',
          },
        },
        required: ['foo2', 'bar2'],
      },
    );
  });

  it('Should add property(s) correctly', () => {
    let schema = new ObjectSchema<Empty>();
    assert.deepEqual(schema.schema, { __type: 'object' });
    schema = schema.properties({
      foo: string(),
    });
    assert.deepEqual(
      schema.schema,
      {
        __type: 'object',
        properties: {
          foo: {
            __type: 'string',
          },
        },
        required: ['foo'],
      },
    );

    schema = schema.addProperty('bar', number());
    assert.deepEqual(
      schema.schema,
      {
        __type: 'object',
        properties: {
          foo: {
            __type: 'string',
          },
          bar: {
            __type: 'number',
          },
        },
        required: ['foo', 'bar'],
      },
    );

    schema = schema.addProperties({
      foo2: string(),
      bar2: number(),
    });
    assert.deepEqual(
      schema.schema,
      {
        __type: 'object',
        properties: {
          foo: {
            __type: 'string',
          },
          bar: {
            __type: 'number',
          },
          foo2: {
            __type: 'string',
          },
          bar2: {
            __type: 'number',
          },
        },
        required: ['foo', 'bar', 'foo2', 'bar2'],
      },
    );
  });

  it('Should interact with optional property correctly', () => {
    let schema = new ObjectSchema<Empty>();
    assert.deepEqual(schema.schema, { __type: 'object' });

    schema = schema.properties({
      foo: string().optional(),
      bar: number(),
    });
    assert.deepEqual(
      schema.schema,
      {
        __type: 'object',
        properties: {
          foo: {
            __type: 'string',
            'x-optional': true,
          },
          bar: {
            __type: 'number',
          },
        },
        required: ['bar'],
      },
    );

    schema = schema.addProperties({
      foo2: string(),
      bar2: number().optional(),
    });
    assert.deepEqual(
      schema.schema,
      {
        __type: 'object',
        properties: {
          foo: {
            __type: 'string',
            'x-optional': true,
          },
          bar: {
            __type: 'number',
          },
          foo2: {
            __type: 'string',
          },
          bar2: {
            __type: 'number',
            'x-optional': true,
          },
        },
        required: ['bar', 'foo2'],
      },
    );
  });

  it('Should work with getPropertySchema correctly', () => {
    const schema = new ObjectSchema<Empty>().properties({
      foo: string().default('abc'),
      bar: number(),
    });
    const fooSchema = schema.getPropertySchema('foo');
    assert.deepEqual(
      fooSchema.schema,
      {
        __type: 'string',
        default: 'abc',
      }
    );
  });

  it('Should work with pick correctly', () => {
    const schema = new ObjectSchema<Empty>().properties({
      foo: string().default('abc'),
      bar: number().optional(),
      barz: number(),
    });
    const pickedSchema = schema.pick('foo', 'bar');
    assert.deepEqual(
      pickedSchema.schema,
      {
        __type: 'object',
        properties: {
          foo: {
            __type: 'string',
            default: 'abc',
          },
          bar: {
            __type: 'number',
            'x-optional': true,
          },
        },
        required: ['foo'],
      }
    )
  });

  it('Should interact with nullable & optional correctly', () => {
    const schema = new ObjectSchema();

    assert.deepEqual(
      schema.schema,
      {
        __type: 'object',
      },
    );

    assert.deepEqual(
      schema.nullable().schema,
      {
        __type: 'object',
        'x-nullable': true,
      },
    );

    assert.deepEqual(
      schema.optional().schema,
      {
        __type: 'object',
        'x-optional': true,
      },
    );

    assert.deepEqual(
      schema.nullable().optional().schema,
      {
        __type: 'object',
        'x-nullable': true,
        'x-optional': true,
      },
    );
  });
});
