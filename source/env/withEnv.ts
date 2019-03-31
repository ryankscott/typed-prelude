import { Disposable } from '@typed/disposable'
import { Arity1 } from '@typed/lambda'
import { Env } from './Env'

export function withEnv<A, B>(fn: Arity1<A, B>): Env<A, B> {
  return {
    runEnv: (f, e) => (f(fn(e)), Disposable.None),
  }
}
