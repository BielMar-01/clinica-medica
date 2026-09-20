import {
  useEffect,
  useState,
} from 'react'

import type {
  ResolvedTheme,
  ThemePreference,
} from '../types/theme'

const THEME_STORAGE_KEY =
  'clinica-medica-theme'

const DARK_MODE_QUERY =
  '(prefers-color-scheme: dark)'

function isThemePreference(
  value: string | null,
): value is ThemePreference {
  return (
    value === 'system' ||
    value === 'light' ||
    value === 'dark'
  )
}

function getStoredPreference():
  ThemePreference {
  const storedPreference =
    localStorage.getItem(
      THEME_STORAGE_KEY,
    )

  if (
    isThemePreference(
      storedPreference,
    )
  ) {
    return storedPreference
  }

  return 'system'
}

function getSystemTheme():
  ResolvedTheme {
  return window.matchMedia(
    DARK_MODE_QUERY,
  ).matches
    ? 'dark'
    : 'light'
}

function resolveTheme(
  preference: ThemePreference,
): ResolvedTheme {
  if (
    preference === 'system'
  ) {
    return getSystemTheme()
  }

  return preference
}

function applyTheme(
  theme: ResolvedTheme,
) {
  document.documentElement.setAttribute(
    'data-theme',
    theme,
  )

  document.documentElement.style.colorScheme =
    theme
}

export function useTheme() {
  const [
    preference,
    setPreference,
  ] =
    useState<ThemePreference>(
      getStoredPreference,
    )

  const [
    resolvedTheme,
    setResolvedTheme,
  ] =
    useState<ResolvedTheme>(
      () =>
        resolveTheme(
          getStoredPreference(),
        ),
    )

  useEffect(
    () => {
      const mediaQuery =
        window.matchMedia(
          DARK_MODE_QUERY,
        )

      function updateTheme() {
        const nextTheme =
          preference === 'system'
            ? (
              mediaQuery.matches
                ? 'dark'
                : 'light'
            )
            : preference

        setResolvedTheme(
          nextTheme,
        )

        applyTheme(
          nextTheme,
        )
      }

      updateTheme()

      if (
        preference === 'system'
      ) {
        mediaQuery.addEventListener(
          'change',
          updateTheme,
        )
      }

      return () => {
        mediaQuery.removeEventListener(
          'change',
          updateTheme,
        )
      }
    },
    [
      preference,
    ],
  )

  function changeTheme(
    nextPreference:
      ThemePreference,
  ) {
    localStorage.setItem(
      THEME_STORAGE_KEY,
      nextPreference,
    )

    setPreference(
      nextPreference,
    )
  }

  return {
    preference,
    resolvedTheme,
    changeTheme,
  }
}