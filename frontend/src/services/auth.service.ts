import type {
  LoginRequest,
  LoginResponse,
  MeResponse,
  RefreshResponse,
} from '../types/auth'

import {
  apiRequest,
} from './api'

export async function loginRequest(
  credentials: LoginRequest,
) {
  return apiRequest<LoginResponse>(
    '/api/auth/login',
    {
      method: 'POST',

      body: JSON.stringify(
        credentials,
      ),

      retryOnUnauthorized:
        false,
    },
  )
}

export async function refreshRequest() {
  return apiRequest<RefreshResponse>(
    '/api/auth/refresh',
    {
      method: 'POST',

      retryOnUnauthorized:
        false,
    },
  )
}

export async function logoutRequest() {
  return apiRequest<void>(
    '/api/auth/logout',
    {
      method: 'POST',

      retryOnUnauthorized:
        false,
    },
  )
}

export async function meRequest(
  accessToken?: string,
) {
  return apiRequest<MeResponse>(
    '/api/auth/me',
    {
      method: 'GET',

      accessToken,
    },
  )
}