import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import {
  configureApiAuth,
} from '../services/api'

import {
  loginRequest,
  logoutRequest,
  refreshRequest,
} from '../services/auth.service'

import type {
  AuthUser,
  LoginRequest,
} from '../types/auth'

type AuthContextValue = {
  user: AuthUser | null
  accessToken: string | null

  isAuthenticated: boolean
  isLoading: boolean

  login: (
    credentials: LoginRequest,
  ) => Promise<void>

  logout: () => Promise<void>

  refreshSession:
    () => Promise<string | null>
}

export const AuthContext =
  createContext<
    AuthContextValue | undefined
  >(undefined)

type AuthProviderProps = {
  children: ReactNode
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [
    user,
    setUser,
  ] =
    useState<
      AuthUser | null
    >(null)

  const [
    accessToken,
    setAccessToken,
  ] =
    useState<
      string | null
    >(null)

  const [
    isLoading,
    setIsLoading,
  ] =
    useState(true)

  const clearSession =
    useCallback(() => {
      setAccessToken(null)
      setUser(null)
    }, [])

  const setSession =
    useCallback(
      (
        newAccessToken: string,
        newUser: AuthUser,
      ) => {
        setAccessToken(
          newAccessToken,
        )

        setUser(
          newUser,
        )
      },
      [],
    )

  const refreshSession =
    useCallback(
      async () => {
        try {
          const response =
            await refreshRequest()

          setSession(
            response.accessToken,
            response.user,
          )

          return response
            .accessToken
        } catch {
          clearSession()

          return null
        }
      },
      [
        clearSession,
        setSession,
      ],
    )

  useEffect(() => {
    configureApiAuth({
      getAccessToken:
        () => accessToken,

      setSession,

      clearSession,
    })
  }, [
    accessToken,
    setSession,
    clearSession,
  ])

  useEffect(() => {
    async function restoreSession() {
      await refreshSession()

      setIsLoading(false)
    }

    void restoreSession()
  }, [
    refreshSession,
  ])

  async function login(
    credentials: LoginRequest,
  ) {
    const response =
      await loginRequest(
        credentials,
      )

    setSession(
      response.accessToken,
      response.user,
    )
  }

  async function logout() {
    try {
      await logoutRequest()
    } finally {
      clearSession()
    }
  }

  const value =
    useMemo<
      AuthContextValue
    >(
      () => ({
        user,
        accessToken,

        isAuthenticated:
          Boolean(
            user &&
            accessToken,
          ),

        isLoading,

        login,
        logout,
        refreshSession,
      }),
      [
        user,
        accessToken,
        isLoading,
        refreshSession,
      ],
    )

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  )
}