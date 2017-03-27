import 'mocha'
import { assert } from 'chai'
import { Either } from 'ramda-fantasy'

import { string, integer, array } from '../src'
import { validate } from '../src/validate'

describe('Base schema test', () => {
  it('Should validate simple string ok', () => {
    const input = 'randomstring'
    const schema = string()
    const result = validate(schema, input)
    assert(result.equals(Either.of(input)))
  })

  it('Should fail when some criteria are invalid', () => {
    const input = 'randomstring'

    assert(Either.isLeft(validate(string().maxLength(5), input)))
    assert(Either.isLeft(validate(string().minLength(20), input)))
    assert(Either.isLeft(validate(string().enum(['random', 'string']), input)))
  })

  it('Should success when validate nullable schema with null & string values, fail otherwise', () => {
    const schema = string().nullable()
    assert(Either.isRight(validate(schema, 'string')))
    assert(Either.isRight(validate(schema, null)))
    assert(Either.isLeft((validate(schema, 1))))
    assert(Either.isLeft((validate(schema, {}))))
    assert(Either.isLeft((validate(schema, []))))
    assert(Either.isLeft((validate(schema, undefined))))
    assert(Either.isLeft((validate(schema, new Date()))))
  })

  it('Should success when validate array schema', () => {
    const schema = array({
      foo: string(),
      bar: integer(),
    })

    assert(Either.isRight(validate(schema, [{ foo: 'string', bar: 1 }])))
  })
})
