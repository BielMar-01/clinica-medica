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

type VerifyResetCodeRequest = {
  email: string
  codigo: string
}

type VerifyResetCodeResponse = {
  status: 'ok'
  message: string
  resetToken: string
}

type ResetPasswordRequest = {
  resetToken: string
  novaSenha: string
  confirmarSenha: string
}

type ResetPasswordResponse = {
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

export async function verifyResetCodeRequest(
  input: VerifyResetCodeRequest,
) {
  return apiRequest<VerifyResetCodeResponse>(
    '/api/auth/verify-reset-code',
    {
      method: 'POST',

      body: JSON.stringify(
        input,
      ),

      retryOnUnauthorized:
        false,
    },
  )
}

export async function resetPasswordRequest(
  input: ResetPasswordRequest,
) {
  return apiRequest<ResetPasswordResponse>(
    '/api/auth/reset-password',
    {
      method: 'POST',

      body: JSON.stringify(
        input,
      ),

      retryOnUnauthorized:
        false,
    },
  )
}