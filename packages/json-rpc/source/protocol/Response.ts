import { DropNever } from './DropNever'
import { Id } from './Id'
import { Json } from './Json'

export type Response<A extends Json = never, B extends Json = never> = Failure<A> | Success<B>

export type Failure<A extends Json = never> = {
  readonly jsonrpc: '2.0'
  readonly id: Id | null
  readonly error: JsonRpcError<A>
}

export type JsonRpcError<A = never> = DropNever<{
  readonly code: number
  readonly message: string
  readonly data: A
}>

export type Success<A extends Json = never> = DropNever<{
  readonly jsonrpc: '2.0'
  readonly id: Id
  readonly result: A
}>
