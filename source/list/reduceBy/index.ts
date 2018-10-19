import { curry } from '../../lambda'

export const reduceBy: ReduceByArity4 = curry(
  <A, B>(
    f: (acc: B, x: A) => B,
    seed: B,
    by: (a: A) => PropertyKey,
    list: A[],
  ): { readonly [key: string]: B } => {
    const length = list.length
    const newObj: any = {}

    for (let i = 0; i < length; ++i) {
      const a = list[i]
      const key = by(a)
      const b = f(newObj[key] || seed, a)

      newObj[key] = b
    }

    return newObj
  },
)
export interface ReduceByArity4 {
  <A, B>(f: (acc: B, value: A) => B, seed: B, by: (a: A) => PropertyKey | number, list: A[]): {
    readonly [key: string]: B
  }

  <A, B>(f: (acc: B, value: A) => B): ReduceByArity3<A, B>
  <A, B>(f: (acc: B, value: A) => B, seed: B): ReduceByArity2<A, B>
  <A, B>(f: (acc: B, value: A) => B, seed: B, by: (a: A) => PropertyKey): ReduceByArity1<A, B>
}

export interface ReduceByArity3<A, B> {
  (seed: B, by: (a: A) => PropertyKey | number, list: A[]): { readonly [key: string]: B }
  (seed: B, by: (a: A) => PropertyKey | number): ReduceByArity1<A, B>
  (seed: B): ReduceByArity2<A, B>
}

export interface ReduceByArity2<A, B> {
  (by: (a: A) => PropertyKey | number, list: A[]): { readonly [key: string]: B }
  (by: (a: A) => PropertyKey | number): ReduceByArity1<A, B>
}

export type ReduceByArity1<A, B> = (list: A[]) => { readonly [key: string]: B }
