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
