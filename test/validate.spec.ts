import 'mocha'
import { assert } from 'chai'
import { string, integer, array } from '../src'
import { validate } from '../src/validate'
import { nullable } from '../src/operators'

describe('Base schema test', () => {
  it('Should validate simple string ok', () => {
    const input = 'randomstring'
    const schema = string()
    const result = validate(schema, input)
    assert.equal(input, result.value)
  })

  it('Should fail when some criteria are invalid', () => {
    const input = 'randomstring'

    assert.isDefined(validate(string().maxLength(5), input).error)
    assert.isDefined(validate(string().minLength(20), input).error)
    assert.isDefined(validate(string().enum(['random', 'string']), input).error)
  })

  it('Should success when validate nullable schema with null & string values, fail otherwise', () => {
    const schema = nullable(string())
    assert.isUndefined(validate(schema, 'string').error)
    assert.isUndefined(validate(schema, null).error)
    assert.isDefined(validate(schema, 1).error)
    assert.isDefined(validate(schema, {}).error)
    assert.isDefined(validate(schema, []).error)
    assert.isDefined(validate(schema, undefined).error)
    assert.isDefined(validate(schema, new Date()).error)
  })

  it('Should success when validate array schema', () => {
    const schema = array().items({
      foo: string(),
      bar: integer(),
    })

    assert.doesNotThrow(() => validate(schema, [{ foo: 'string', bar: 1 }]))
  })
})
