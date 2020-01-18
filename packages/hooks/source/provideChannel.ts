import { Effect, get } from '@typed/effects'
import { Env } from '@typed/env'
import { fromJust, Just } from '@typed/maybe'
import { Channel } from './Channel'
import { HookEnvironment, InitialState } from './HookEnvironment'
import { useDepChange } from './useDepChange'

type UpdateChannel<A> = (value: A) => Effect<Env<never, any>, A, any>

export function* provideChannel<A>(channel: Channel<A>, initial: InitialState<A>) {
  const { useChannel, provideChannel, useRef } = yield* get<HookEnvironment>()
  const [updateChannel, setUpdateChannel] = yield* useRef<UpdateChannel<A>>()
  const channelHasChanged = yield* useDepChange(channel)
  const currentValue = yield* useChannel(channel)

  if (channelHasChanged) {
    setUpdateChannel(yield* provideChannel(channel, initial))
  }

  return [currentValue, fromJust(updateChannel.current as Just<UpdateChannel<A>>)] as const
}
