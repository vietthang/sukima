import 'mocha'
import { assert } from 'chai'
import { equals } from 'ramda'

import { string, number } from '../src'
import { ObjectSchema } from '../src/schemas/object'

const RANDOM_NUMBER_1 = Math.random()
const RANDOM_NUMBER_2 = Math.random()

function assertDeepEqual (lhs: any, rhs: any) {
  return assert(equals<any>(lhs, rhs))
}

describe('Object schema test', () => {
  it('Should create simple object schema correctly', () => {
    const schema = new ObjectSchema({})
    assertDeepEqual(schema.props, { type: 'object', properties: {} })
  })

  it('Should set, overwrite & remove minProperties correctly', () => {
    let schema = new ObjectSchema({})
    assertDeepEqual(schema.props, { type: 'object', properties: {} })
    assertDeepEqual(
      schema.minProperties(RANDOM_NUMBER_1).props,
      { type: 'object', minProperties: RANDOM_NUMBER_1, properties: {} },
    )
    assertDeepEqual(
      schema.minProperties(RANDOM_NUMBER_2).props,
      { type: 'object', minProperties: RANDOM_NUMBER_2, properties: {} },
    )
  })

  it('Should set, overwrite & remove maxProperties correctly', () => {
    let schema = new ObjectSchema({})
    assertDeepEqual(schema.props, { type: 'object', properties: {} })
    assertDeepEqual(
      schema.maxProperties(RANDOM_NUMBER_1).props,
      { type: 'object', maxProperties: RANDOM_NUMBER_1, properties: {} },
    )
    assertDeepEqual(
      schema.maxProperties(RANDOM_NUMBER_2).props,
      { type: 'object', maxProperties: RANDOM_NUMBER_2, properties: {} },
    )
  })

  it('Should set properties correctly', () => {
    let schema = new ObjectSchema({
      foo: string(),
      bar: number(),
    })
    assert(
      equals<any>(
        schema.props,
        {
          type: 'object',
          properties: {
            foo: {
              props: {
                type: 'string',
              },
            },
            bar: {
              props: {
                type: 'number',
              },
            },
          },
        },
      ),
    )
  })

  it('Should interact with optional property correctly', () => {
    let schema = new ObjectSchema({
      foo: string().optional(),
      bar: number(),
    })

    assert(
      equals<any>(
        schema.props,
        {
          type: 'object',
          properties: {
            foo: {
              props: {
                type: 'string',
                optional: true,
              },
            },
            bar: {
              props: {
                type: 'number',
              },
            },
          },
        },
      ),
    )
  })

  it('Should interact with nullable & optional correctly', () => {
    const schema = new ObjectSchema({})

    assertDeepEqual(
      schema.props,
      {
        type: 'object',
        properties: {},
      },
    )

    assertDeepEqual(
      schema.optional().props,
      {
        type: 'object',
        properties: {},
        'optional': true,
      },
    )
  })
})
