import 'mocha'
import * as assert from 'assert'

import { string, integer, array } from '../src'
import { validate } from '../src/validate'

describe('Base schema test', () => {
  it('Should validate simple string ok', () => {
    const input = 'randomstring'
    const schema = string()
    const result = validate(schema, input)
    assert(result === input)
  })

  it('Should fail when some criteria are invalid', () => {
    const input = 'randomstring'

    assert.throws(() => validate(string().maxLength(5), input))
    assert.throws(() => validate(string().minLength(20), input))
    assert.throws(() => validate(string().enum(['random', 'string']), input))
  })

  it('Should success when validate nullable schema with null & string values, fail otherwise', () => {
    const schema = string().nullable()
    assert.doesNotThrow(() => validate(schema, 'string'))
    assert.doesNotThrow(() => validate(schema, null))
    assert.throws(() => validate(schema, 1))
    assert.throws(() => validate(schema, {}))
    assert.throws(() => validate(schema, []))
    assert.throws(() => validate(schema, undefined))
    assert.throws(() => validate(schema, new Date()))
  })

  it('Should success when validate array schema', () => {
    const schema = array({
      foo: string(),
      bar: integer(),
    })

    assert.doesNotThrow(() => validate(schema, [{ foo: 'string', bar: 1 }]))
  })
})
