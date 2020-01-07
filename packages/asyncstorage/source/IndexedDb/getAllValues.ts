import { Disposable } from '@typed/disposable'
import { Future } from '@typed/future'
import { ItemsEffect } from '../AsyncStorage'

export function getAllValues<A>(store: IDBObjectStore): ItemsEffect<A> {
  return Future.create<never, Error, readonly A[]>((reject, resolve) => {
    const request = store.getAll()

    let disposable: Disposable = Disposable.None
    request.onerror = ev => (disposable = reject(new Error((ev.target as any).errorCode)))
    request.onsuccess = () => (disposable = resolve(request.result))

    return Disposable.lazy(() => disposable)
  })
}
