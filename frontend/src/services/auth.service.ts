import type {
  LoginRequest,
  LoginResponse,
  MeResponse,
  RefreshResponse,
} from '../types/auth'

import {
  apiRequest,
} from './api'

type ForgotPasswordResponse = {
  status: 'ok'
  message: string
}

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

export async function forgotPasswordRequest(
  email: string,
) {
  return apiRequest<ForgotPasswordResponse>(
    '/api/auth/forgot-password',
    {
      method: 'POST',

      body: JSON.stringify({
        email,
      }),

      retryOnUnauthorized:
        false,
    },
  )
}