import { Compact, EmptyObject } from '@typed/common'
import { IO, OrToAnd } from '@typed/lambda'
import { Resume } from './Resume'

/**
 * A computation that has all capabilities supplied
 */
export interface Pure<A> {
  // tslint:disable-next-line:callable-types
  <C extends EmptyObject>(capabilities: C): Resume<A>
}

/**
 * Generic type for computations that depend on capabilities
 * from the environment.
 */
export interface Env<C extends EmptyObject, A> {
  // tslint:disable-next-line:callable-types
  (capabilities: C): Resume<A>
}

/**
 * Extracts the capabilities required to satisfy an environment
 */
export type CapabilitiesOf<A> = A extends Env<infer R, any> ? Compact<OrToAnd<R>> : EmptyObject

/**
 * Get the return value of an Env
 */
export type ValueOf<A> = A extends Env<any, infer R> ? R : A extends Pure<infer R> ? R : never

export namespace Pure {
  export const of = <A>(value: A): Pure<A> => _ => Resume.of(value)
  export const fromIO = <A>(io: IO<A>): Pure<A> => _ => Resume.create(cb => cb(io()))
}
