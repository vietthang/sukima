import 'mocha';
import assert = require('assert');
import { BooleanSchema } from '../src/schemas/boolean';

describe('Boolean schema test', () => {
  it('Should create simple boolean schema correctly', () => {
    const schema = new BooleanSchema();
    assert.deepEqual(schema.getJsonSchema(), { type: 'boolean'});
  })

  it('Should interact with nullable & optional correctly', () => {
    const schema = new BooleanSchema();
    assert.deepEqual(schema.getJsonSchema(), { type: 'boolean'});
    assert.deepEqual(schema.nullable().getJsonSchema(), { type: 'boolean', 'x-nullable': true });
    assert.deepEqual(schema.nullable().notNullable().getJsonSchema(), { type: 'boolean', 'x-nullable': false });
    assert.deepEqual(schema.notNullable().getJsonSchema(), { type: 'boolean', 'x-nullable': false });
    assert.deepEqual(schema.optional().getJsonSchema(), { type: 'boolean', 'x-optional': true });
    assert.deepEqual(schema.required().getJsonSchema(), { type: 'boolean', 'x-optional': false });
    assert.deepEqual(
      schema.nullable().optional().getJsonSchema(),
      { type: 'boolean', 'x-optional': true, 'x-nullable': true },
    );
  })
});
