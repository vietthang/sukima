import { validate, object, string, number } from '../src';
// import { flow, mapValues, omitBy, isUndefined } from 'lodash'

// console.log(cloneDeep(new Date()))
// import { allOf } from '../src/operators';

// const schema = object().properties({
//   foo: string(),
//   bar: string().nullable(),
// });

// const composedSchema = allOf(
//   schema,
//   object().properties({
//     fooz: string(),
//   }).additionalProperties(false)
// );

// console.log(composedSchema.getJsonSchema());

// // validate(composedSchema, { foo: 'foo', bar: null, fooz: 'abc', blah: 'blah' })
// //   .then(o => {
// //     const a = o['blah'];
// //     console.log(a);
// //   })
// //   .catch(e => console.error(e));

// validate(
//   object().properties({
//     foo: string(),
//     bar: string(),
//   }).addProperty('barz', { barzzz: string() }),
//   'a',
// ).then((v) => {
//   // v.barz.barzzz
// })

// const o = validate(, { abc: 'abc' });
// const o = validate(
//   object().properties({
//     foo: string(),
//     bar: number(),
//   }).pick('foo'),
//   null,
// );

// const o = validate({
//   'nullable': true,
//   'type': 'string',
// } as any as JsonSchema, null)

// flow(
//   omitBy(isUndefined)
//   mapValues()
// )({
//   foo: 'a',
//   bar: 'b',
//   u: undefined,
// })

try {
  const schema = object().properties({
    foo: string().nullable(),
    bar: number().optional(),
  })

  const o = validate(
    schema,
    {
      foo: null,
      bar: undefined,
    }
  )

  console.log('o', o)
} catch (e) {
  console.log(e)
}

