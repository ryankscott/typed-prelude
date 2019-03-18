import { Disposable } from '@most/types'
import { Subscriptions } from '@typed/common/Subscriptions'
import { Subscriber } from 'cote'
import { LogLevel, TestIdToMetadataId } from '../types'
import { metadataEventNames, MetadataToTestIdEvent } from './common'

export type CreateTestIdToMetadataIdServerOptions = {
  namespace: string
  logLevel: LogLevel
}

export type TestIdToMetadataIdServer = Disposable & {
  readonly subscribe: (
    testRunId: number,
    cb: (TestIdToMetadataId: TestIdToMetadataId) => void,
  ) => Disposable
  readonly once: (testRunId: number) => Promise<TestIdToMetadataId>
}

export function createTestIdToMetadataIdServer({
  namespace,
  logLevel,
}: CreateTestIdToMetadataIdServerOptions): TestIdToMetadataIdServer {
  const subscriber = new Subscriber(
    { namespace, name: 'TestIdToMetadataId Server', subscribesTo: metadataEventNames },
    { log: LogLevel.DEBUG === logLevel },
  )
  const { subscribe, once, dispose: clearSubscriptions, publish } = new Subscriptions<
    number,
    TestIdToMetadataId
  >()
  const dispose = () => {
    clearSubscriptions()
    subscriber.removeAllListeners()
    subscriber.close()
  }

  subscriber.on(metadataEventNames[0], ({ testRunId, testIdToMetadataId }: MetadataToTestIdEvent) =>
    publish(testRunId, new Map(testIdToMetadataId)),
  )

  return { subscribe, once, dispose }
}
