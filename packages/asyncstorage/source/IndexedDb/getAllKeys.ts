import { Disposable } from '@typed/disposable'
import { Future } from '@typed/future'
import { ItemsEffect } from '../AsyncStorage'

export function getAllKeys(store: IDBObjectStore): ItemsEffect<string> {
  return Future.create<never, Error, readonly string[]>((reject, resolve) => {
    const request = store.getAllKeys()

    let disposable: Disposable = Disposable.None
    request.onerror = ev => (disposable = reject(new Error((ev.target as any).errorCode)))
    request.onsuccess = () => (disposable = resolve(request.result.map(x => x.toString())))

    return Disposable.lazy(() => disposable)
  })
}
