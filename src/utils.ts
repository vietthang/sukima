import mapValues = require('lodash/mapValues');
import omitBy = require('lodash/omitBy');
import isUndefined = require('lodash/isUndefined');

/** @internal */
export function evictUndefined(value: any): any {
  if (value === null) {
    return null;
  }

  if ('object' !== typeof value) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(evictUndefined);
  }

  value = omitBy(value, isUndefined);
  value = mapValues(value, evictUndefined);

  return value;
}

interface SomeMap<K, V> {
  delete(key: K): boolean;
  get(key: K): V | undefined;
  has(key: K): boolean;
  set(key: K, value?: V): this;
}

class Cache<K, V> implements SomeMap<K, V> {

  private readonly weakMap = new WeakMap<K, V>();

  private readonly map = new Map<K, V>();

  delete(key: K) {
    return this.getMapInstance(key).delete(key);
  }

  get(key: K) {
    return this.getMapInstance(key).get(key);
  }

  has(key: K) {
    return this.getMapInstance(key).has(key);
  }

  set(key: K, value: V): this {
    this.getMapInstance(key).set(key, value);
    return this;
  }

  private getMapInstance(key: K): SomeMap<K, V> {
    switch (typeof key) {
      case 'number':
      case 'string':
      case 'boolean':
      case 'symbol':
        return this.map;
      case 'object':
      case 'function':
        return this.weakMap;
      default:
        throw new Error('Invalid typeof')
    }
  }

}

function makeCache<K, V>() {
  if (WeakMap !== undefined) {
    return new Cache<K, V>();
  } else {
    return undefined;
  }
}

/** @internal */
export function memoize<T, U>(functor: (arg: T) => U): (arg: T) => U {
  const cache = makeCache<T, U>();

  if (cache !== undefined) {
    return (arg: T): U => {
      if (cache.has(arg)) {
        return cache.get(arg) as U;
      }

      const result = functor(arg);
      cache.set(arg, result);
      return result;
    };
  } else {
    return functor;
  }
}
