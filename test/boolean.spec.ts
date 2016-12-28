import 'mocha';
import assert = require('assert');
import { BooleanSchema } from '../src/schemas/boolean';

describe('Boolean schema test', () => {
  it('Should create simple boolean schema correctly', () => {
    const schema = new BooleanSchema();
    assert.deepEqual(schema.getJsonSchema(), { type: 'boolean'});
  });

  it('Should interact with nullable & optional correctly', () => {
    const schema = new BooleanSchema();

    assert.deepEqual(
      schema.getJsonSchema(),
      {
        type: 'boolean',
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
            type: 'boolean',
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
            type: 'boolean',
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
            type: 'boolean',
          },
        ]
      },
    );
  });
});
