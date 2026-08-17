import type {
  ApiErrorResponse,
  RefreshResponse,
} from '../types/auth'

import {
  ApiError,
} from './api-error'

const API_URL =
  import.meta.env.VITE_API_URL

if (!API_URL) {
  throw new Error(
    'VITE_API_URL não está configurada',
  )
}

type ApiRequestOptions =
  RequestInit & {
    accessToken?: string | null
    retryOnUnauthorized?: boolean
  }

type AuthHandlers = {
  getAccessToken: () => string | null

  setSession: (
    accessToken: string,
    user: RefreshResponse['user'],
  ) => void

  clearSession: () => void
}

let authHandlers:
  AuthHandlers | null = null

let refreshPromise:
  Promise<RefreshResponse | null> | null =
    null

export function configureApiAuth(
  handlers: AuthHandlers,
) {
  authHandlers = handlers
}

async function parseResponse(
  response: Response,
): Promise<unknown> {
  if (response.status === 204) {
    return undefined
  }

  const contentType =
    response.headers.get(
      'content-type',
    )

  if (
    contentType?.includes(
      'application/json',
    )
  ) {
    return response.json()
  }

  return response.text()
}

async function refreshAccessToken(): Promise<
  RefreshResponse | null
> {
  if (refreshPromise) {
    return refreshPromise
  }

  refreshPromise = fetch(
    `${API_URL}/api/auth/refresh`,
    {
      method: 'POST',

      credentials: 'include',

      headers: {
        'Content-Type':
          'application/json',
      },
    },
  )
    .then(
      async (
        response,
      ): Promise<
        RefreshResponse | null
      > => {
        if (!response.ok) {
          authHandlers?.clearSession()

          return null
        }

        const data =
          (await response.json()) as RefreshResponse

        authHandlers?.setSession(
          data.accessToken,
          data.user,
        )

        return data
      },
    )
    .catch(() => {
      authHandlers?.clearSession()

      return null
    })
    .finally(() => {
      refreshPromise = null
    })

  return refreshPromise
}

export async function apiRequest<T>(
  path: string,
  options:
    ApiRequestOptions = {},
): Promise<T> {
  const {
    accessToken,
    retryOnUnauthorized = true,
    headers,
    ...requestOptions
  } = options

  const currentAccessToken =
    accessToken ??
    authHandlers?.getAccessToken() ??
    null

  const response = await fetch(
    `${API_URL}${path}`,
    {
      ...requestOptions,

      credentials: 'include',

      headers: {
        'Content-Type':
          'application/json',

        ...(currentAccessToken
          ? {
              Authorization:
                `Bearer ${currentAccessToken}`,
            }
          : {}),

        ...headers,
      },
    },
  )

  if (
    response.status === 401 &&
    retryOnUnauthorized &&
    path !==
      '/api/auth/login' &&
    path !==
      '/api/auth/refresh'
  ) {
    const refreshResult =
      await refreshAccessToken()

    if (refreshResult) {
      return apiRequest<T>(
        path,
        {
          ...options,

          accessToken:
            refreshResult.accessToken,

          retryOnUnauthorized:
            false,
        },
      )
    }
  }

  const data =
    await parseResponse(
      response,
    )

  if (!response.ok) {
    if (
      typeof data === 'object' &&
      data !== null
    ) {
      const apiError =
        data as ApiErrorResponse

      throw new ApiError(
        apiError.message ??
          'Erro ao processar requisição',
        response.status,
        apiError.code,
        apiError.details,
      )
    }

    throw new ApiError(
      'Erro ao processar requisição',
      response.status,
    )
  }

  return data as T
}

export {
  API_URL,
}