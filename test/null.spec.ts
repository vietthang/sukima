import 'mocha';
import assert = require('assert');
import { NullSchema } from '../src/schemas/null';

describe('Null schema test', () => {
  it('Should create simple boolean schema correctly', () => {
    const schema = new NullSchema();
    assert.deepEqual(schema.getJsonSchema(), { type: 'null' });
  });

  it('Should interact with nullable & optional correctly', () => {
    const schema = new NullSchema();
    assert.deepEqual(
      schema.getJsonSchema(),
      {
        type: 'null',
      },
    );

    assert.deepEqual(
      schema.nullable().getJsonSchema(),
      {
        anyOf: [
          {
            enum: [ null ],
          },
          {
            type: 'null',
          },
        ]
      },
    );

    assert.deepEqual(
      schema.optional().getJsonSchema(),
      {
        anyOf: [
          {
            enum: [ undefined ],
          },
          {
            type: 'null',
          },
        ]
      },
    );

    assert.deepEqual(
      schema.nullable().optional().getJsonSchema(),
      {
        anyOf: [
          {
            enum: [ null, undefined ],
          },
          {
            type: 'null',
          },
        ]
      },
    );
  });
});
