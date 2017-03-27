import { mapObjIndexed, equals, pickBy, pipe, not } from 'ramda'

/** @internal */
export function evictUndefined(value: any): any {
  if (value === null) {
    return null
  }

  if ('object' !== typeof value) {
    return value
  }

  if (Array.isArray(value)) {
    return value.map(evictUndefined)
  }

  value = pickBy(pipe(equals(undefined), not), value)
  value = mapObjIndexed(evictUndefined, value)

  return value
}

interface SomeMap<K, V> {
  delete(key: K): boolean
  get(key: K): V | undefined
  has(key: K): boolean
  set(key: K, value?: V): this
}

class Cache<V> implements SomeMap<any, V> {

  private readonly weakMap = new WeakMap<any, V>()

  private readonly map = new Map<any, V>()

  delete(key: any) {
    return this.getMapInstance(key).delete(key)
  }

  get(key: any) {
    return this.getMapInstance(key).get(key)
  }

  has(key: any) {
    return this.getMapInstance(key).has(key)
  }

  set(key: any, value: V): this {
    this.getMapInstance(key).set(key, value)
    return this
  }

  private getMapInstance(key: any): SomeMap<any, V> {
    switch (typeof key) {
      case 'number':
      case 'string':
      case 'boolean':
      case 'symbol':
        return this.map
      case 'object':
      case 'function':
        return this.weakMap
      default:
        throw new Error('Invalid typeof')
    }
  }

}

function makeCache<V>() {
  if (WeakMap !== undefined) {
    return new Cache<V>()
  } else {
    return undefined
  }
}

/** @internal */
export function memoize<T, U>(functor: (arg: T) => U): (arg: T) => U {
  const cache = makeCache<U>()

  if (cache !== undefined) {
    return (arg: T): U => {
      if (cache.has(arg)) {
        return cache.get(arg) as U
      }

      const result = functor(arg)
      cache.set(arg, result)
      return result
    }
  } else {
    return functor
  }
}
