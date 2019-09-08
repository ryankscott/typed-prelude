import { DropKeys } from '@typed/common'
import { Disposable, withIsDisposed } from '@typed/disposable'
import { curry, IO, noOp } from '@typed/lambda'

/**
 * Generic type for computations that depend on resources
 * from the environment.
 */
export type Env<A = any, B = any> = {
  readonly runEnv: (cb: (value: B) => void, environment: A) => Disposable
}

/**
 * A computation that has all evironmental dependencies handled
 */
export interface Pure<A = any> extends Env<{}, A> {}

/**
 * Mapped-type to environments of A
 */
export type EnvOf<A, B> = { readonly [K in keyof B]: Env<A, B[K]> }

/**
 * Provide resources to an Env
 */
export type Handle<A, E extends Env<any, any>> = Exclude<
  keyof EnvResources<E>,
  keyof A
> extends never
  ? Pure<EnvValue<E>>
  : Env<DropKeys<EnvResources<E>, keyof A>, EnvValue<E>>

export type EnvResources<A> = A extends Env<infer R, any> ? R : never
export type EnvValue<A> = A extends Env<any, infer R> ? R : never

export namespace Env {
  /** Can not be cancelled */

  /**
   * Create an Environment with a value
   * @param value :: A
   * @returns Pure<A>
   */
  export const of = <A>(value: A): Pure<A> => fromIO(() => value)
  export const fromIO = <A>(fn: IO<A>): Pure<A> => ({
    runEnv: cb => withIsDisposed(isDisposed => !isDisposed() && cb(fn())),
  })

  export const create = <E, A>(runEnv: Env<E, A>['runEnv']): Env<E, A> => ({ runEnv })
}

export namespace Pure {
  export const of = Env.of
  export const fromIO = Env.fromIO

  // Does nothing
  export const empty: Pure<any> = Env.create(() => Disposable.None)
}

/**
 * Returns true when a value is an Env<A, B>
 * @param x :: any
 */
export function isEnv<A, B>(x: any): x is Env<A, B> {
  return x && x.runEnv && typeof x.runEnv === 'function'
}

/**
 * Runs a Pure Env with the given callback
 * @param f :: (a -> void) Callback for pure Value
 * @param pure :: Pure<A>  Pure to run
 * @returns :: Disposable
 */

export const runPure: {
  <A>(f: (value: A) => void, pure: Pure<A> | Env<{}, A>): Disposable
  <A>(f: (value: A) => void): (pure: Pure<A> | Env<{}, A>) => Disposable
} = curry(function runPure<A>(f: (value: A) => void, { runEnv }: Pure<A> | Env<{}, A>): Disposable {
  return runEnv(f, {})
})

/**
 * Execute a pure ignoring the value it produces.
 * @param pure :: Pure *
 * @returns :: Disposable
 */
export const execPure = (pure: Pure<any> | Env<{}, any>): Disposable => runPure(noOp, pure)
