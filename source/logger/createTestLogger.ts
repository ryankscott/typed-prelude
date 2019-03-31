import { Env } from '@typed/env'
import { clone } from '@typed/objects'
import { Clock } from '@typed/timer'
import { Logger, LogLevel } from './types'

export type CreateTestLoggerOptions = {
  logLevel: LogLevel
  clock: Clock
}

export type TestLogger = {
  logger: Logger
  getLogs: () => Logs
}

export type Logs = ReadonlyArray<Log>

export type Log =
  | { readonly type: 'log'; readonly message: string }
  | { readonly type: 'error'; readonly message: string }
  | { readonly type: 'clear' }
  | { readonly type: 'info'; readonly message: string }
  | { readonly type: 'debug'; readonly message: string }
  | { readonly type: 'timeStart'; readonly label: string; readonly time: number }
  | { readonly type: 'timeEnd'; readonly label: string; readonly time: number }

export function createTestLogger({ logLevel, clock }: CreateTestLoggerOptions): TestLogger {
  const logs: Log[] = []
  const logger: Logger = {
    log: (msg: string) =>
      Env.fromIO(() => {
        if (logLevel > LogLevel.OFF) {
          logs.push({ type: 'log', message: msg })
        }
      }),
    error: (msg: string) =>
      Env.fromIO(() => {
        if (logLevel > LogLevel.OFF) {
          logs.push({ type: 'error', message: msg })
        }
      }),
    clear: () =>
      Env.fromIO(() => {
        if (logLevel > LogLevel.OFF && logLevel < LogLevel.DEBUG) {
          logs.push({ type: 'clear' })
        }
      }),
    info: (msg: string) =>
      Env.fromIO(() => {
        if (logLevel >= LogLevel.INFO) {
          logs.push({ type: 'info', message: msg })
        }
      }),
    debug: (msg: string) =>
      Env.fromIO(() => {
        if (logLevel >= LogLevel.DEBUG) {
          logs.push({ type: 'debug', message: msg })
        }
      }),
    timeStart: (label: string) =>
      Env.fromIO(() => {
        if (logLevel < LogLevel.DEBUG) {
          return
        }

        const time = clock.currentTime()

        logs.push({ type: 'timeStart', label, time })
      }),
    timeEnd: (label: string) =>
      Env.fromIO(() => {
        if (logLevel < LogLevel.DEBUG) {
          return
        }

        const time = clock.currentTime()

        logs.push({ type: 'timeEnd', label, time })
      }),
  }

  return {
    logger,
    getLogs: () => clone(logs),
  }
}
