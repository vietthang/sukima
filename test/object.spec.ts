import 'mocha';
import assert = require('assert');
import { string, number } from '../src';
import { ObjectSchema } from '../src/schemas/object';

const RANDOM_NUMBER_1 = Math.random();
const RANDOM_NUMBER_2 = Math.random();

describe('Object schema test', () => {
  it('Should create simple object schema correctly', () => {
    const schema = new ObjectSchema();
    assert.deepEqual(schema.props, { type: 'object'});
  });

  it('Should set, overwrite & remove minProperties correctly', () => {
    let schema = new ObjectSchema();
    assert.deepEqual(schema.props, { type: 'object' });
    assert.deepEqual(
      schema.minProperties(RANDOM_NUMBER_1).props,
      { type: 'object', minProperties: RANDOM_NUMBER_1 },
    );
    assert.deepEqual(
      schema.minProperties(RANDOM_NUMBER_2).props,
      { type: 'object', minProperties: RANDOM_NUMBER_2 },
    );
  });

  it('Should set, overwrite & remove maxProperties correctly', () => {
    let schema = new ObjectSchema();
    assert.deepEqual(schema.props, { type: 'object' });
    assert.deepEqual(
      schema.maxProperties(RANDOM_NUMBER_1).props,
      { type: 'object', maxProperties: RANDOM_NUMBER_1 },
    );
    assert.deepEqual(
      schema.maxProperties(RANDOM_NUMBER_2).props,
      { type: 'object', maxProperties: RANDOM_NUMBER_2 },
    );
  });

  it('Should set properties correctly', () => {
    let schema = new ObjectSchema<{}>();
    assert.deepEqual(schema.props, { type: 'object' });
    schema = schema.properties({
      foo: string(),
      bar: number(),
    });
    assert.deepEqual(
      schema.props,
      {
        type: 'object',
        properties: {
          foo: {
            props: {
              type: 'string',
            },
          },
          bar: {
            props: {
              type: 'number',
            },
          },
        },
      },
    );
    schema = schema.properties({
      foo2: string(),
      bar2: number(),
    })
    assert.deepEqual(
      schema.props,
      {
        type: 'object',
        properties: {
          foo2: {
            props: {
              type: 'string',
            },
          },
          bar2: {
            props: {
              type: 'number',
            },
          },
        },
      },
    );
  });

  it('Should add property(s) correctly', () => {
    let schema = new ObjectSchema<{}>();
    assert.deepEqual(schema.props, { type: 'object' });
    schema = schema.properties({
      foo: string(),
    });
    assert.deepEqual(
      schema.props,
      {
        type: 'object',
        properties: {
          foo: {
            props: {
              type: 'string',
            },
          },
        },
      },
    );

    schema = schema.addProperty('bar', number());
    assert.deepEqual(
      schema.props,
      {
        type: 'object',
        properties: {
          foo: {
            props: {
              type: 'string',
            },
          },
          bar: {
            props: {
              type: 'number',
            },
          },
        },
      },
    );

    schema = schema.addProperties({
      foo2: string(),
      bar2: number(),
    });
    assert.deepEqual(
      schema.props,
      {
        type: 'object',
        properties: {
          foo: {
            props: {
              type: 'string',
            },
          },
          bar: {
            props: {
              type: 'number',
            },
          },
          foo2: {
            props: {
              type: 'string',
            },
          },
          bar2: {
            props: {
              type: 'number',
            },
          },
        },
      },
    );
  });

  it('Should interact with optional property correctly', () => {
    let schema = new ObjectSchema<{}>();
    assert.deepEqual(schema.props, { type: 'object' });

    schema = schema.properties({
      foo: string().optional(),
      bar: number(),
    });
    assert.deepEqual(
      schema.props,
      {
        type: 'object',
        properties: {
          foo: {
            props: {
              type: 'string',
              optional: true,
            },
          },
          bar: {
            props: {
              type: 'number',
            },
          },
        },
      },
    );

    schema = schema.addProperties({
      foo2: string(),
      bar2: number().optional(),
    });
    assert.deepEqual(
      schema.props,
      {
        type: 'object',
        properties: {
          foo: {
            props: {
              type: 'string',
              optional: true,
            },
          },
          bar: {
            props: {
              type: 'number',
            },
          },
          foo2: {
            props: {
              type: 'string',
            },
          },
          bar2: {
            props: {
              type: 'number',
              optional: true,
            },
          },
        },
      },
    );
  });

  it('Should work with getPropertySchema correctly', () => {
    const schema = new ObjectSchema<{}>().properties({
      foo: string().default('abc'),
      bar: number(),
    });
    const fooSchema = schema.getPropertySchema('foo');
    assert.deepEqual(
      fooSchema.props,
      {
        type: 'string',
        default: 'abc',
      }
    );
  });

  it('Should work with pick correctly', () => {
    const schema = new ObjectSchema<{}>().properties({
      foo: string().default('abc'),
      bar: number().optional(),
      barz: number(),
    });
    const pickedSchema = schema.pick('foo', 'bar');
    assert.deepEqual(
      pickedSchema.props,
      {
        type: 'object',
        properties: {
          foo: {
            props: {
              type: 'string',
              default: 'abc',
            },
          },
          bar: {
            props: {
              type: 'number',
              optional: true,
            },
          },
        },
      }
    )
  });

  it('Should interact with nullable & optional correctly', () => {
    const schema = new ObjectSchema();

    assert.deepEqual(
      schema.props,
      {
        type: 'object',
      },
    );

    assert.deepEqual(
      schema.nullable().props,
      {
        type: 'object',
        'nullable': true,
      },
    );

    assert.deepEqual(
      schema.optional().props,
      {
        type: 'object',
        'optional': true,
      },
    );

    assert.deepEqual(
      schema.nullable().optional().props,
      {
        type: 'object',
        'nullable': true,
        'optional': true,
      },
    );
  });
});
