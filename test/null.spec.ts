import 'mocha';
import assert = require('assert');
import { NullSchema } from '../src/schemas/null';

describe('Boolean schema test', () => {
  it('Should create simple boolean schema correctly', () => {
    const schema = new NullSchema();
    assert.deepEqual(schema.getJsonSchema(), { type: 'null' });
  })

  it('Should interact with nullable & optional correctly', () => {
    const schema = new NullSchema();
    assert.deepEqual(schema.getJsonSchema(), { type: 'null'});
    assert.deepEqual(schema.nullable().getJsonSchema(), { type: 'null', 'x-nullable': true });
    assert.deepEqual(schema.nullable().notNullable().getJsonSchema(), { type: 'null', 'x-nullable': false });
    assert.deepEqual(schema.notNullable().getJsonSchema(), { type: 'null', 'x-nullable': false });
    assert.deepEqual(schema.optional().getJsonSchema(), { type: 'null', 'x-optional': true });
    assert.deepEqual(schema.required().getJsonSchema(), { type: 'null', 'x-optional': false });
    assert.deepEqual(
      schema.nullable().optional().getJsonSchema(),
      { type: 'null', 'x-optional': true, 'x-nullable': true },
    );
  })
});
