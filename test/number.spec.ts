import 'mocha'
import * as assert from 'assert'
import { NumberSchema } from '../src/schemas/number'

const RANDOM_NUMBER_1 = Math.random()
const RANDOM_NUMBER_2 = Math.random()

describe('Number schema test', () => {
  it('Should create simple number schema correctly', () => {
    const schema = new NumberSchema()
    assert.deepEqual(schema.props, { type: 'number'})
  })

  it('Should create simple integer schema correctly', () => {
    const schema = new NumberSchema('integer')
    assert.deepEqual(schema.props, { type: 'integer'})
  })

  it('Should set, overwrite & remove multipleOf correctly', () => {
    let schema = new NumberSchema()
    assert.deepEqual(schema.props, { type: 'number' })
    schema = schema.multipleOf(RANDOM_NUMBER_1)
    assert.deepEqual(schema.props, { type: 'number', multipleOf: RANDOM_NUMBER_1 })
    schema = schema.multipleOf(RANDOM_NUMBER_2)
    assert.deepEqual(schema.props, { type: 'number', multipleOf: RANDOM_NUMBER_2 })
  })

  it('Should set, overwrite & remove maximum correctly', () => {
    let schema = new NumberSchema()
    assert.deepEqual(schema.props, { type: 'number'})
    schema = schema.maximum(RANDOM_NUMBER_1)
    assert.deepEqual(schema.props, { type: 'number', maximum: RANDOM_NUMBER_1 })
    schema = schema.maximum(RANDOM_NUMBER_2)
    assert.deepEqual(schema.props, { type: 'number', maximum: RANDOM_NUMBER_2 })
  })

  it('Should set, overwrite & remove minimum correctly', () => {
    let schema = new NumberSchema()
    assert.deepEqual(schema.props, { type: 'number'})
    schema = schema.minimum(RANDOM_NUMBER_1)
    assert.deepEqual(schema.props, { type: 'number', minimum: RANDOM_NUMBER_1 })
    schema = schema.minimum(RANDOM_NUMBER_2)
    assert.deepEqual(schema.props, { type: 'number', minimum: RANDOM_NUMBER_2 })
  })

  it('Should set, overwrite & remove exclusiveMaximum correctly', () => {
    let schema = new NumberSchema()
    assert.deepEqual(schema.props, { type: 'number'})
    schema = schema.exclusiveMaximum(false)
    assert.deepEqual(schema.props, { type: 'number', exclusiveMaximum: false })
    schema = schema.exclusiveMaximum(true)
    assert.deepEqual(schema.props, { type: 'number', exclusiveMaximum: true })
  })

  it('Should set, overwrite & remove exclusiveMinimum correctly', () => {
    let schema = new NumberSchema()
    assert.deepEqual(schema.props, { type: 'number'})
    schema = schema.exclusiveMinimum(false)
    assert.deepEqual(schema.props, { type: 'number', exclusiveMinimum: false })
    schema = schema.exclusiveMinimum(true)
    assert.deepEqual(schema.props, { type: 'number', exclusiveMinimum: true })
  })

  it('Should interact with nullable & optional correctly', () => {
    const schema = new NumberSchema()

    assert.deepEqual(
      schema.props,
      {
        type: 'number',
      },
    )

    assert.deepEqual(
      schema.optional().props,
      {
        type: 'number',
        'optional': true,
      },
    )
  })
})
