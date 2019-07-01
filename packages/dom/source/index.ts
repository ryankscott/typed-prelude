import { createDomEnv } from './dom'

export const {
  window,
  document,
  location,
  history,
  localStorage,
  sessionStorage,
  customElements,
  Event,
  CustomEvent,
} = createDomEnv({
  serverUrl: typeof process !== 'undefined' ? process.env.TYPED_SERVER_URL : void 0,
})

export * from './addEventListener'
export * from './checks'
export * from './dom'
export * from './hooks'
export * from './querySelector'
export * from './tagged'
export * from './types'
