import { Disposable } from '@typed/disposable'
import { isFailure, isSuccess, RemoteData } from '@typed/remote-data'
import { Timer } from '@typed/timer'
import { HttpCallbacks, HttpOptions, HttpResponse, TestHttpEnv } from './types'

/**
 * Create a test-friendly http environment
 * @param testHttp :: (url -> HttpOptions -> Either Error HttpResponse)
 * @param timer :: Timer
 */
export function createTestHttpEnv(
  testHttp: (url: string, options: HttpOptions) => RemoteData<Error, HttpResponse>,
  timer: Timer,
): TestHttpEnv {
  const responses: Array<RemoteData<Error, HttpResponse>> = []

  function http(url: string, options: HttpOptions, callbacks: HttpCallbacks): Disposable {
    const { success, failure, onStart } = callbacks

    function getResponse() {
      if (onStart) {
        onStart()
      }

      const response = testHttp(url, options)

      responses.push(response)

      if (isFailure(response)) {
        failure(response.value)
      }

      if (isSuccess(response)) {
        success(response.value)
      }
    }

    return timer.delay(getResponse, 0)
  }

  return {
    http,
    getResponses: () => responses.slice(),
  }
}

export function createSuccessfulResponse(options: Partial<HttpResponse> = {}) {
  return RemoteData.of<Error, HttpResponse>(createHttpResponse(options))
}

export function createFailedResponse(error: Error) {
  return RemoteData.failure<Error, HttpResponse>(error)
}

export function createHttpResponse<A>(options: Partial<HttpResponse<A>> = {}): HttpResponse<A> {
  const response: HttpResponse<A> = {
    status: 200,
    statusText: '',
    responseText: '',
    headers: {},
    ...options,
  }

  return response
}

export function createJsonResponse(
  jsonReadyValue: any,
  options: Partial<HttpResponse> = {},
): HttpResponse {
  const responseText = JSON.stringify(jsonReadyValue)

  return createHttpResponse({ ...options, responseText })
}
