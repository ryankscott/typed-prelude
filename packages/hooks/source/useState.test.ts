import { Effect, runEffects } from '@typed/effects'
import { Pure } from '@typed/env'
import { describe, given, it } from '@typed/test'
import { NodeGenerator } from '@typed/uuid'
import { increment } from '../../math/source'
import { createHookEnvironment } from './createHookEnvironment'
import { createHooksManager } from './createHooksManager'
import { InitialState } from './HookEnvironment'
import { useState } from './useState'
import { withHooks } from './withHooks'

export const test = describe(`useState`, [
  given(`an initial state`, [
    it(`returns a current state and updater fn`, ({ equal }, done) => {
      const manager = createHooksManager(new NodeGenerator())
      const hookEnvironment = createHookEnvironment(manager)
      const expectedValues = [1, 2, 3]
      const test = withHooks(function*() {
        const [getX, updateX] = yield* useState(InitialState.of(1))
        const expected = expectedValues.shift()
        const actual = yield* getX()

        if (!expected) {
          return done()
        }

        try {
          equal(expected, actual)
          yield* updateX(increment)
        } catch (error) {
          done(error)
        }
      })

      runEffects(test(), { hookEnvironment })
    }),
  ]),
])
