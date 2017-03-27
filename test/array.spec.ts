import 'mocha'
import 'source-map-support/register'
import { assert } from 'chai'
import { equals } from 'ramda'

import { ArraySchema } from '../src/schemas/array'
import { StringSchema } from '../src/schemas/string'
import { NumberSchema } from '../src/schemas/number'

const RANDOM_NUMBER_1 = Math.random()
const RANDOM_NUMBER_2 = Math.random()

describe('Array schema test', () => {
  it('Should create simple string schema correctly', () => {
    const schema = new ArraySchema()
    assert.deepEqual(schema.props, { type: 'array', items: undefined })
  })

  it('Should set, overwrite & remove maxItems correctly', () => {
    let schema = new ArraySchema()
    assert.deepEqual(schema.props, { type: 'array', items: undefined })
    schema = schema.maxItems(RANDOM_NUMBER_1)
    assert.deepEqual(schema.props, { type: 'array', maxItems: RANDOM_NUMBER_1, items: undefined })
    schema = schema.maxItems(RANDOM_NUMBER_2)
    assert.deepEqual(schema.props, { type: 'array', maxItems: RANDOM_NUMBER_2, items: undefined })
  })

  it('Should set, overwrite & remove minItems correctly', () => {
    let schema = new ArraySchema()
    assert.deepEqual(schema.props, { type: 'array', items: undefined })
    schema = schema.minItems(RANDOM_NUMBER_1)
    assert.deepEqual(schema.props, { type: 'array', minItems: RANDOM_NUMBER_1, items: undefined })
    schema = schema.minItems(RANDOM_NUMBER_2)
    assert.deepEqual(schema.props, { type: 'array', minItems: RANDOM_NUMBER_2, items: undefined })
  })

  it('Should set, overwrite & remove uniqueItems correctly', () => {
    let schema = new ArraySchema()
    assert.deepEqual(schema.props, { type: 'array', items: undefined })
    schema = schema.uniqueItems(false)
    assert.deepEqual(schema.props, { type: 'array' , uniqueItems: false, items: undefined })
    schema = schema.uniqueItems(true)
    assert.deepEqual(schema.props, { type: 'array' , uniqueItems: true, items: undefined })
  })

  it('Should set, overwrite & remove items correctly', () => {
    const stringArraySchema = new ArraySchema(new StringSchema())
    assert(equals<any>(stringArraySchema.props, { type: 'array' , items: { props: { type: 'string' } } }))
    const schema = new ArraySchema({
      stringKey: new StringSchema(),
      objectKey: {
        numberKey: new NumberSchema(),
      },
    })
    assert(
      equals<any>(
        schema.props,
        {
          type: 'array',
          items: {
            props: {
              type: 'object',
              properties: {
                stringKey: {
                  props: {
                    type: 'string',
                  },
                },
                objectKey: {
                  props: {
                    type: 'object',
                    properties: {
                      numberKey: {
                        props: {
                          type: 'number',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      ),
    )
  })

  it('Should interact with optional correctly', () => {
    const schema = new ArraySchema()

    assert.deepEqual(
      schema.props,
      {
        type: 'array',
        items: undefined,
      },
    )

    assert.deepEqual(
      schema.optional().props,
      {
        type: 'array',
        optional: true,
        items: undefined,
      },
    )
  })
})
