import { DropKeys } from '../common/types'
import { Defined, Primitive } from '../lambda'

export type Prop<T, K extends PropertyKey> = K extends keyof T ? T[K] : undefined
export type ObjectPath<T, Keys extends PropertyKey[]> = Keys extends []
  ? T
  : Keys extends [keyof T]
    ? Prop<T, Keys[0]>
    : Keys extends [PropertyKey, PropertyKey]
      ? Prop<Prop<T, Keys[0]>, Keys[1]>
      : Keys extends [PropertyKey, PropertyKey, PropertyKey]
        ? Prop<Prop<Prop<T, Keys[0]>, Keys[1]>, Keys[2]>
        : Keys extends [PropertyKey, PropertyKey, PropertyKey, PropertyKey]
          ? Prop<Prop<Prop<Prop<T, Keys[0]>, Keys[1]>, Keys[2]>, Keys[3]>
          : Keys extends [PropertyKey, PropertyKey, PropertyKey, PropertyKey, PropertyKey]
            ? Prop<Prop<Prop<Prop<Prop<T, Keys[0]>, Keys[1]>, Keys[2]>, Keys[3]>, Keys[4]>
            : undefined

export type ValuesOf<A> = { [K in keyof A]: A[K] }[keyof A]

export type MergeObjects<A, B> = B extends A
  ? B
  : {
      [K in keyof A | keyof B]: K extends keyof B
        ? K extends keyof A ? Defined<A[K] | B[K]> : B[K]
        : K extends keyof A ? A[K] : never
    }

export type Overwrite<A, B> = B extends A
  ? B
  : { [K in keyof A | keyof B]: K extends keyof B ? B[K] : K extends keyof A ? A[K] : never }

export type OptionalKeys<A extends object, K extends keyof A> = DropKeys<A, K> & Partial<Pick<A, K>>

export type Immutable<A> = A extends Primitive
  ? A
  : A extends Array<infer B>
    ? ImmutableArray<B>
    : A extends Map<infer K, infer V> ? ImmutableMap<K, V> : ImmutableObject<A>

export interface ImmutableArray<A> extends ReadonlyArray<Immutable<A>> {}
export interface ImmutableMap<K, V> extends ReadonlyMap<Immutable<K>, Immutable<V>> {}
export type ImmutableObject<A> = { readonly [K in keyof A]: Immutable<A[K]> }

export type ExtractUnionMember<
  A extends object,
  Tag extends keyof A,
  Value extends A[Tag]
> = Extract<A, Record<Tag, Value>>

export type Mutable<A> = A extends Primitive ? A : MutableObject<A>
export type MutableObject<A> = { -readonly [K in keyof A]: Mutable<A[K]> }
