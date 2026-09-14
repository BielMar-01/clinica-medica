import {
  createContext,
} from 'react'

import type {
  AuthUser,
  LoginRequest,
} from '../types/auth'

export type AuthContextValue = {
  user: AuthUser | null

  accessToken:
    | string
    | null

  isAuthenticated: boolean

  isLoading: boolean

  login: (
    credentials: LoginRequest,
  ) => Promise<void>

  logout: () => Promise<void>

  refreshSession:
    () => Promise<
      string | null
    >
}

export const AuthContext =
  createContext<
    AuthContextValue | undefined
  >(undefined)