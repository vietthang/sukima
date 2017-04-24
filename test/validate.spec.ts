import 'mocha'
import * as assert from 'assert'

import { string, integer, array } from '../src'
import { validate } from '../src/validate'

describe('Base schema test', () => {
  it('Should validate simple string ok', () => {
    const input = 'randomstring'
    const schema = string()
    const result = validate(schema, input)
    assert.deepEqual(result, { value: input })
  })

  it('Should fail when some criteria are invalid', () => {
    const input = 'randomstring'

    assert(validate(string().maxLength(5), input).error)
    assert(validate(string().minLength(20), input).error)
    assert(validate(string().enum(['random', 'string']), input).error)
  })

  it('Should success when validate nullable schema with null & string values, fail otherwise', () => {
    const schema = string().nullable()
    assert(validate(schema, 'string').error === undefined)
    assert(validate(schema, null).error === undefined)
    assert(validate(schema, 1).error)
    assert(validate(schema, {}).error)
    assert(validate(schema, new Date()).error)
  })

  it('Should success when validate array schema', () => {
    const schema = array({
      foo: string(),
      bar: integer(),
    })

    assert(validate(schema, [{ foo: 'string', bar: 1 }]).error === undefined)
  })
})
