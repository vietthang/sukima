import 'mocha'
import assert = require('assert')
import { StringSchema } from '../src/schemas/string'

const RANDOM_STRING_1 = Math.random().toLocaleString()
const RANDOM_STRING_2 = Math.random().toLocaleString()
const RANDOM_NUMBER_1 = Math.random()
const RANDOM_NUMBER_2 = Math.random()

describe('String schema test', () => {
  it('Should create simple string schema correctly', () => {
    const schema = new StringSchema()
    assert.deepEqual(schema.props, { type: 'string'})
  })

  it('Should set, overwrite & remove format correctly', () => {
    let schema = new StringSchema()
    assert.deepEqual(schema.props, { type: 'string' })
    schema = schema.format(RANDOM_STRING_1)
    assert.deepEqual(schema.props, { type: 'string', format: RANDOM_STRING_1 })
    schema = schema.format(RANDOM_STRING_2)
    assert.deepEqual(schema.props, { type: 'string', format: RANDOM_STRING_2 })
  })

  it('Should set, overwrite & remove maxLength correctly', () => {
    let schema = new StringSchema()
    assert.deepEqual(schema.props, { type: 'string' })
    schema = schema.maxLength(RANDOM_NUMBER_1)
    assert.deepEqual(schema.props, { type: 'string', maxLength: RANDOM_NUMBER_1 })
    schema = schema.maxLength(RANDOM_NUMBER_2)
    assert.deepEqual(schema.props, { type: 'string', maxLength: RANDOM_NUMBER_2 })
  })

  it('Should set, overwrite & remove minLength correctly', () => {
    let schema = new StringSchema()
    assert.deepEqual(schema.props, { type: 'string' })
    schema = schema.minLength(RANDOM_NUMBER_1)
    assert.deepEqual(schema.props, { type: 'string' , minLength: RANDOM_NUMBER_1 })
    schema = schema.minLength(RANDOM_NUMBER_2)
    assert.deepEqual(schema.props, { type: 'string' , minLength: RANDOM_NUMBER_2 })
  })

  it('Should set, overwrite & remove pattern correctly', () => {
    let schema = new StringSchema()
    assert.deepEqual(schema.props, { type: 'string' })
    schema = schema.pattern(RANDOM_STRING_1)
    assert.deepEqual(schema.props, { type: 'string' , pattern: RANDOM_STRING_1 })
    schema = schema.pattern(new RegExp(RANDOM_STRING_2))
    assert.deepEqual(schema.props, { type: 'string' , pattern: RANDOM_STRING_2 })
  })

  it('Should interact with nullable & optional correctly', () => {
    const schema = new StringSchema()

    assert.deepEqual(
      schema.props,
      {
        type: 'string',
      },
    )

    assert.deepEqual(
      schema.nullable().props,
      {
        type: 'string',
        'nullable': true,
      },
    )

    assert.deepEqual(
      schema.optional().props,
      {
        type: 'string',
        'optional': true,
      },
    )

    assert.deepEqual(
      schema.nullable().optional().props,
      {
        type: 'string',
        'nullable': true,
        'optional': true,
      },
    )
  })
})
