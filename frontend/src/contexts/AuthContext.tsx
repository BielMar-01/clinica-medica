import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
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

import {
  AuthContext,
} from './auth-context'

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

  const accessTokenRef =
    useRef<string | null>(
      null,
    )

  const [
    isLoading,
    setIsLoading,
  ] =
    useState(true)

  const clearSession =
    useCallback(() => {
      accessTokenRef.current =
        null

      setAccessToken(null)

      setUser(null)
    }, [])

  const setSession =
    useCallback(
      (
        newAccessToken: string,
        newUser: AuthUser,
      ) => {
        accessTokenRef.current =
          newAccessToken

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

  const login =
    useCallback(
      async (
        credentials:
          LoginRequest,
      ) => {
        const response =
          await loginRequest(
            credentials,
          )

        setSession(
          response.accessToken,
          response.user,
        )
      },
      [
        setSession,
      ],
    )

  const logout =
    useCallback(
      async () => {
        try {
          await logoutRequest()
        } finally {
          clearSession()
        }
      },
      [
        clearSession,
      ],
    )

  useEffect(() => {
    configureApiAuth({
      getAccessToken:
        () =>
          accessTokenRef.current,

      setSession,

      clearSession,
    })
  }, [
    setSession,
    clearSession,
  ])

  useEffect(() => {
    async function restoreSession() {
      try {
        await refreshSession()
      } finally {
        setIsLoading(false)
      }
    }

    void restoreSession()
  }, [
    refreshSession,
  ])

  const value =
    useMemo(
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
        login,
        logout,
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