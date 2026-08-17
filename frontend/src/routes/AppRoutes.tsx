import {
  Navigate,
  Route,
  Routes,
} from 'react-router'

import {
  ProtectedRoute,
} from '../components/ProtectedRoute'

import {
  AppLayout,
} from '../layouts/AppLayout'

import {
  DashboardPage,
} from '../pages/DashboardPage'

import {
  LoginPage,
} from '../pages/LoginPage'

import {
  NotFoundPage,
} from '../pages/NotFoundPage'

import {
  PatientsPage,
} from '../pages/PatientsPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <LoginPage />
        }
      />

      <Route
        element={
          <ProtectedRoute />
        }
      >
        <Route
          element={
            <AppLayout />
          }
        >
          <Route
            path="/dashboard"
            element={
              <DashboardPage />
            }
          />

          <Route
            path="/pacientes"
            element={
              <PatientsPage />
            }
          />

          <Route
            path="/"
            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }
          />
        </Route>
      </Route>

      <Route
        path="*"
        element={
          <NotFoundPage />
        }
      />
    </Routes>
  )
}