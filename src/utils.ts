import mapValues = require('lodash/mapValues');
import omitBy = require('lodash/omitBy');
import isUndefined = require('lodash/isUndefined');

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

export function memoize<T, U>(cache: WeakMap<T, U> | undefined, functor: (arg: T) => U): (arg: T) => U {
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
