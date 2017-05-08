import 'mocha'
import * as assert from 'assert'

import { Schema, SchemaType } from '../src/schemas/base'

class SchemaImpl extends Schema<any> {

  public constructor(type: SchemaType) {
    super({ type })
  }

}

const RANDOM_STRING_1 = 'RANDOM_STRING_1'
const RANDOM_STRING_2 = 'RANDOM_STRING_2'

describe('Base schema test', () => {
  it('Should create simple object schema correctly', () => {
    const schema = new SchemaImpl('object')
    assert.deepEqual(schema.props, { type: 'object'})
  })

  it('Should set, overwrite & remove id correctly', () => {
    let schema = new SchemaImpl('object')
    assert.deepEqual(schema.props, { type: 'object'})
    schema = schema.id(RANDOM_STRING_1)
    assert.deepEqual(schema.props, { type: 'object', id: RANDOM_STRING_1 })
    schema = schema.id(RANDOM_STRING_2)
    assert.deepEqual(schema.props, { type: 'object', id: RANDOM_STRING_2 })
  })

  it('Should set, overwrite & remove title correctly', () => {
    let schema = new SchemaImpl('object')
    assert.deepEqual(schema.props, { type: 'object'})
    schema = schema.title(RANDOM_STRING_1)
    assert.deepEqual(schema.props, { type: 'object', title: RANDOM_STRING_1 })
    schema = schema.title(RANDOM_STRING_2)
    assert.deepEqual(schema.props, { type: 'object', title: RANDOM_STRING_2 })
  })

  it('Should set, overwrite & remove description correctly', () => {
    let schema = new SchemaImpl('object')
    assert.deepEqual(schema.props, { type: 'object'})
    schema = schema.description(RANDOM_STRING_1)
    assert.deepEqual(schema.props, { type: 'object', description: RANDOM_STRING_1 })
    schema = schema.description(RANDOM_STRING_2)
    assert.deepEqual(schema.props, { type: 'object', description: RANDOM_STRING_2 })
  })

  it('Should set, overwrite default correctly', () => {
    let schema = new SchemaImpl('object')
    assert.deepEqual(schema.props, { type: 'object'})
    schema = schema.default(RANDOM_STRING_1)
    assert.deepEqual(schema.props, { type: 'object', default: RANDOM_STRING_1 })
    schema = schema.default(RANDOM_STRING_2)
    assert.deepEqual(schema.props, { type: 'object', default: RANDOM_STRING_2 })
  })

  it('Should set, overwrite enum correctly', () => {
    let schema = new SchemaImpl('object')
    assert.deepEqual(schema.props, { type: 'object'})
    schema = schema.enum([RANDOM_STRING_1])
    assert.deepEqual(schema.props, { type: 'object', enum: [RANDOM_STRING_1] })
    schema = schema.enum([RANDOM_STRING_1, RANDOM_STRING_2])
    assert.deepEqual(schema.props, { type: 'object', enum: [RANDOM_STRING_1, RANDOM_STRING_2] })
  })

  it('Should set and get metadata correctly', () => {
    let schema = new SchemaImpl('object')
    assert.deepEqual(schema.props, { type: 'object'})
    schema = schema.meta('foo', 'bar').meta('fooz', [1, 2, 3])
    assert.equal(schema.props.meta!.foo, 'bar')
    assert.deepEqual(schema.props.meta!.fooz, [1, 2, 3])
    assert.equal(schema.props.meta!.foozz, undefined)
  })
})
