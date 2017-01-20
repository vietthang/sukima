import 'mocha';
import { assert } from 'chai';
import { string, integer, array } from '../src';
import { validate } from '../src/validate';

describe('Base schema test', () => {
  it('Should validate simple string ok', () => {
    const input = 'randomstring';
    const schema = string();
    const output = validate(schema, input);
    assert.equal(input, output);
  });

  it('Should fail when some criteria are invalid', () => {
    const input = 'randomstring';

    assert.throw(() => validate(string().maxLength(5), input));
    assert.throw(() => validate(string().minLength(20), input));
    assert.throw(() => validate(string().enum(['random', 'string']), input));
  });

  it('Should success when validate nullable schema with null & string values, fail otherwise', () => {
    assert.doesNotThrow(() => validate(string().nullable(), 'string'));
    assert.doesNotThrow(() => validate(string().nullable(), null));
    assert.throw(() => validate(string().nullable(), 1));
    assert.throw(() => validate(string().nullable(), {}));
    assert.throw(() => validate(string().nullable(), undefined));
    assert.throw(() => validate(string().nullable(), new Date()));
  });

  it('Should success when validate array schema', () => {
    const schema = array().items({
      foo: string(),
      bar: integer(),
    });

    assert.doesNotThrow(() => validate(schema, [{ foo: 'string', bar: 1 }]));
  });
});
