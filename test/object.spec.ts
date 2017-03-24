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
    const schema = new ObjectSchema()
    assertDeepEqual(schema.props, { type: 'object'})
  })

  it('Should set, overwrite & remove minProperties correctly', () => {
    let schema = new ObjectSchema()
    assertDeepEqual(schema.props, { type: 'object' })
    assertDeepEqual(
      schema.minProperties(RANDOM_NUMBER_1).props,
      { type: 'object', minProperties: RANDOM_NUMBER_1 },
    )
    assertDeepEqual(
      schema.minProperties(RANDOM_NUMBER_2).props,
      { type: 'object', minProperties: RANDOM_NUMBER_2 },
    )
  })

  it('Should set, overwrite & remove maxProperties correctly', () => {
    let schema = new ObjectSchema()
    assertDeepEqual(schema.props, { type: 'object' })
    assertDeepEqual(
      schema.maxProperties(RANDOM_NUMBER_1).props,
      { type: 'object', maxProperties: RANDOM_NUMBER_1 },
    )
    assertDeepEqual(
      schema.maxProperties(RANDOM_NUMBER_2).props,
      { type: 'object', maxProperties: RANDOM_NUMBER_2 },
    )
  })

  it('Should set properties correctly', () => {
    let schema = new ObjectSchema<object, never, object>()
    assertDeepEqual(schema.props, { type: 'object' })
    schema = schema.properties({
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
    schema = schema.properties({
      foo2: string(),
      bar2: number(),
    })
    assert(
      equals<any>(
        schema.props,
        {
          type: 'object',
          properties: {
            foo2: {
              props: {
                type: 'string',
              },
            },
            bar2: {
              props: {
                type: 'number',
              },
            },
          },
        },
      ),
    )
  })

  it('Should add property(s) correctly', () => {
    let schema = new ObjectSchema<object, never, object>()
    assertDeepEqual(schema.props, { type: 'object' })
    schema = schema.properties({
      foo: string(),
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
          },
        },
      ),
    )

    schema = schema.addProperty('bar', number())
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

    schema = schema.addProperties({
      foo2: string(),
      bar2: number(),
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
            foo2: {
              props: {
                type: 'string',
              },
            },
            bar2: {
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
    let schema = new ObjectSchema<object, never, object>()
    assertDeepEqual(schema.props, { type: 'object' })

    schema = schema.properties({
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

    schema = schema.addProperties({
      foo2: string(),
      bar2: number().optional(),
    })
    assertDeepEqual(
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
          foo2: {
            props: {
              type: 'string',
            },
          },
          bar2: {
            props: {
              type: 'number',
              optional: true,
            },
          },
        },
      },
    )
  })

  it('Should work with getPropertySchema correctly', () => {
    const schema = new ObjectSchema<object, never, object>().properties({
      foo: string().default('abc'),
      bar: number(),
    })
    const fooSchema = schema.getPropertySchema('foo')
    assertDeepEqual(
      fooSchema.props,
      {
        type: 'string',
        default: 'abc',
      },
    )
  })

  it('Should work with pick correctly', () => {
    const schema = new ObjectSchema<object, never, object>().properties({
      foo: string().default('abc'),
      bar: number().optional(),
      barz: number(),
    })
    const pickedSchema = schema.pick('foo', 'bar')
    assertDeepEqual(
      pickedSchema.props,
      {
        type: 'object',
        properties: {
          foo: {
            props: {
              type: 'string',
              default: 'abc',
            },
          },
          bar: {
            props: {
              type: 'number',
              optional: true,
            },
          },
        },
      },
    )
  })

  it('Should get list key correctly', () => {
    const schema = new ObjectSchema<object, never, object>().properties({
      foo: string().default('abc'),
      bar: number().optional(),
      barz: number(),
    })
    assertDeepEqual(schema.keys(), ['foo', 'bar', 'barz'])
  })

  it('Should interact with nullable & optional correctly', () => {
    const schema = new ObjectSchema()

    assertDeepEqual(
      schema.props,
      {
        type: 'object',
      },
    )

    assertDeepEqual(
      schema.optional().props,
      {
        type: 'object',
        'optional': true,
      },
    )
  })
})
