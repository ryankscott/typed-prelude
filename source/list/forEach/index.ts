import { Arity2, curry } from '@typed/lambda'

export type ArrayLikeValue<A> = A extends ArrayLike<infer R> ? R : never

export const forEach = curry(__forEach) as {
  <R, A extends ArrayLike<R>>(f: Arity2<R, number, void>, list: A): A
  <R>(f: Arity2<R, number, void>): <A extends ArrayLike<R>>(list: A) => A
}

function __forEach<R, A extends ArrayLike<R>>(f: Arity2<R, number, void>, list: A): A {
  for (let i = 0; i < list.length; ++i) {
    f(list[i], i)
  }

  return list
}
