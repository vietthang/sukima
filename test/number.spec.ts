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
    schema = schema.exclusiveMaximum(RANDOM_NUMBER_1)
    assert.deepEqual(schema.props, { type: 'number', exclusiveMaximum: RANDOM_NUMBER_1 })
    schema = schema.exclusiveMaximum(RANDOM_NUMBER_2)
    assert.deepEqual(schema.props, { type: 'number', exclusiveMaximum: RANDOM_NUMBER_2 })
  })

  it('Should set, overwrite & remove exclusiveMinimum correctly', () => {
    let schema = new NumberSchema()
    assert.deepEqual(schema.props, { type: 'number'})
    schema = schema.exclusiveMinimum(RANDOM_NUMBER_1)
    assert.deepEqual(schema.props, { type: 'number', exclusiveMinimum: RANDOM_NUMBER_1 })
    schema = schema.exclusiveMinimum(RANDOM_NUMBER_2)
    assert.deepEqual(schema.props, { type: 'number', exclusiveMinimum: RANDOM_NUMBER_2 })
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
