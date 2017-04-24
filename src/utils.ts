/** @internal */
export function mapValues<T, U>(iteratee: (entry: T[keyof T], key: keyof T) => U, obj: T): { [key in keyof T]: U } {
  const keys = Object.keys(obj) as (keyof T)[]

  return keys.reduce<{ [key in keyof T]: U }>(
    (prev, key) => {
      return Object.assign(
        prev,
        { [key]: iteratee(obj[key], key) },
      )
    },
    {} as any,
  )
}

/** @internal */
export function clone<T>(input: T): T {
  return JSON.parse(JSON.stringify(input))
}
