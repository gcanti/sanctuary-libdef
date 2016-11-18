// @flow

import type { Maybe } from 'sanctuary'
import { create, env } from 'sanctuary'

const S = create({ checkTypes: false, env })

console.log(S.S(a => b => a + b, Math.sqrt, 100))

const double = (n: number): number => 2 * n
const length = (s: string): number => s.length

//
// type
//
S.type(1)
// $ExpectError
S.type(1, 2)

//
// is
//
S.is(Number, 1)
S.is(Number, 'a')

// $ExpectError
S.is(Number, 1, 2)

//
// K
//
const ka: number = S.K(1, 2)

// $ExpectError
const kb: number = S.K('a', 2)

const kfa: () => number = S.K(1)

// $ExpectError
const kfb: () => string = S.K(1)

//
// A
//
const aa: number = S.A(n => n * 2, 1)

// $ExpectError
const ab: number = S.A(n => n * 2, 'a')

const afa: (n: number) => number = S.A(n => n * 2)

// $ExpectError
const afb: (n: number) => string = S.K(n => n * 2)

//
// compose
//
S.compose(double, length)
S.compose(double)(length)
S.compose(double)(length, 'a')
S.compose(double)(length)('a')

//
// pipe
//
S.pipe([length, double])
S.pipe([length, double])('a')
S.pipe([length, double], 'aaaa')

//
// Maybe
//
S.Nothing
S.Nothing.map(double)

const just1: Maybe<number> = S.Just(1)

// $ExpectError
S.Just(1, 2)

// ** concat **
just1.concat(S.Just(2))

// $ExpectError
just1.concat(S.Just('a'))

// ** map **
just1.map(double)

// $ExpectError
just1.map(length)

const maybex: Maybe<number> = just1.map(double)

// $ExpectError
const maybey: Maybe<string> = just1.map(double)

// ** toString **
just1.toString()

// ** reduce **
S.Nothing.reduce(S.add, 10)
S.Just(5).reduce(S.add, 10)

//
// fromMaybe
//
S.fromMaybe(0, S.Just(42))
S.fromMaybe(0)(S.Just(42))

//
// maybe
//
S.maybe('s', length, S.Just('a'))
S.maybe('s', length)(S.Just('a'))
S.maybe('s')(length, S.Just('a'))
S.maybe('s')(length)(S.Just('a'))

//
// Either
//

// ** reduce **
S.Left('Cannot divide by zero').reduce((xs, x) => xs.concat([x]), [42])
S.Right(5).reduce((xs, x) => xs.concat([x]), [42])

//
// and
//
S.and(S.Just(1), S.Just(2))

//
// concat
//
S.concat([1, 2, 3], [4, 5, 6])
S.concat('foo', 'bar')
S.concat(S.Just('foo'), S.Just('bar'))

// $ExpectError
;(S.concat(S.Just('foo'), 'bar'): string)

// $ExpectError
S.concat(1, 2)

//
// slice
//
S.slice(2, 6, 'banana')

//
// sum
//
S.sum([1, 2, 3, 4, 5])
S.sum([])
S.sum(S.Just(42))
S.sum(S.Nothing)

// $ExpectError
S.sum(null)

//
// get
//
S.get(Number, 'x', {x: 1, y: 2})
S.get(Number, 'x', {x: '1', y: '2'})
S.get(Number, 'x', {})

//
// gets
//
S.gets(Number, ['a', 'b', 'c'], {a: {b: {c: 42}}})
S.gets(Number, ['a', 'b', 'c'], {a: {b: {c: '42'}}})
S.gets(Number, ['a', 'b', 'c'], {})

//
// parseJson
//
S.parseJson(Array, '["foo","bar","baz"]')
S.parseJson(Array, '[')
S.parseJson(Object, '["foo","bar","baz"]')

//
// lift
//
S.lift(S.inc, S.Just(2))
S.lift(S.inc, S.Nothing)

//
// lift2
//
// S.lift2(S.add, S.Just(2), S.Just(3))
S.lift2(S.add, S.Right(2), S.Right(3))
// S.lift2(S.add, S.Just(2), S.Nothing)
// S.lift2(S.and, S.Just(true), S.Just(true))
// S.lift2(S.and, S.Just(true), S.Just(false))

//
// lift3
//
// S.lift3(S.reduce, S.Just(S.add), S.Just(0), S.Just([1, 2, 3]))
// S.lift3(S.reduce, S.Just(S.add), S.Just(0), S.Nothing)

//
// reduce
//
S.reduce(S.add, 0, [1, 2, 3, 4, 5])
S.reduce(xs => x => [x].concat(xs), [], [1, 2, 3, 4, 5])
