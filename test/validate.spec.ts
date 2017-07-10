import 'mocha'
import * as assert from 'assert'

import { string, integer, array, object } from '../src'
import { validate } from '../src/validate'

describe('Base schema test', () => {
  it('Should validate simple string ok', () => {
    const input = 'randomstring'
    const schema = string()
    const result = validate(schema, input)
    assert(result.isSuccess())
    assert.deepEqual(result.success(), input)
  })

  it('Should fail when some criteria are invalid', () => {
    const input = 'randomstring'

    assert(validate(string().maxLength(5), input).isFail())
    assert(validate(string().minLength(20), input).isFail())
    assert(validate(string().enum(['random', 'string']), input).isFail())
  })

  it('Should success when validate nullable schema with null & string values, fail otherwise', () => {
    const schema = string().nullable()
    assert(validate(schema, 'string').isSuccess())
    assert(validate(schema, null).isSuccess())
    assert(validate(schema, 1).isFail())
    assert(validate(schema, {}).isFail())
    assert(validate(schema, new Date()).isSuccess())
  })

  it('Should success when validate array schema', () => {
    const schema = array({
      foo: string(),
      bar: integer(),
    })

    assert(validate(schema, [{ foo: 'string', bar: 1 }]).isSuccess())
  })

  it('Should success when validate array schema', () => {
    const schema = object({
      foo: string(),
      bar: integer(),
    }).additionalProperties()

    assert(validate(schema, { foo: 'string', bar: 1, fooz: 1 }).isSuccess())
  })

  it('Should return custom error message when specificed', () => {
    const schema = string().minLength(2).maxLength(10).errorMessage('Should be a string with length between 2 and 10')
    const result = validate(schema, '')
    assert(result.isFail())
    assert(result.failMap(({ errors }) => {
      assert.deepEqual(
        errors,
        [
          {
            keyword: 'errorMessage',
            dataPath: '',
            schemaPath: '#/errorMessage',
            params: {
              errors: [
                {
                  dataPath: '',
                  keyword: 'minLength',
                  message: 'should NOT be shorter than 2 characters',
                  params: {
                    'limit': 2,
                  },
                  schemaPath: '#/minLength',
                },
              ],
            },
            message: 'Should be a string with length between 2 and 10' },
        ],
      )
    }))
  })
})
