import {
  Navigate,
  Outlet,
} from 'react-router'

import {
  useAuth,
} from '../hooks/useAuth'

import {
  LoadingScreen,
} from './LoadingScreen'

export function ProtectedRoute() {
  const {
    isAuthenticated,
    isLoading,
  } = useAuth()

  if (isLoading) {
    return (
      <LoadingScreen />
    )
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    )
  }

  return <Outlet />
}