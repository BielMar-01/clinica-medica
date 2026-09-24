import {
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
  PublicLayout,
} from '../layouts/PublicLayout'

import {
  DashboardPage,
} from '../pages/DashboardPage'

import {
  DoctorsPage,
} from '../pages/DoctorsPage'

import {
  ForgotPasswordPage,
} from '../pages/ForgotPasswordPage'

import {
  LoginPage,
} from '../pages/LoginPage'

import {
  NotFoundPage,
} from '../pages/NotFoundPage'

import {
  PatientsPage,
} from '../pages/PatientsPage'

import {
  HomePage,
} from '../pages/public/HomePage'

import {
  PublicSpecialtiesPage,
} from '../pages/public/PublicSpecialtiesPage'

import {
  ResetPasswordPage,
} from '../pages/ResetPasswordPage'

import {
  SpecialtiesPage,
} from '../pages/SpecialtiesPage'

import {
  UsersPage,
} from '../pages/UsersPage'

import {
  VerifyResetCodePage,
} from '../pages/VerifyResetCodePage'

export function AppRoutes() {
  return (
    <Routes>
      <Route
        element={
          <PublicLayout />
        }
      >
        <Route
          path="/"
          element={
            <HomePage />
          }
        />

        <Route
          path="/especialidades-clinicas"
          element={
            <PublicSpecialtiesPage />
          }
        />
      </Route>

      <Route
        path="/login"
        element={
          <LoginPage />
        }
      />

      <Route
        path="/forgot-password"
        element={
          <ForgotPasswordPage />
        }
      />

      <Route
        path="/verify-reset-code"
        element={
          <VerifyResetCodePage />
        }
      />

      <Route
        path="/reset-password"
        element={
          <ResetPasswordPage />
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
            path="/especialidades"
            element={
              <SpecialtiesPage />
            }
          />

          <Route
            path="/medicos"
            element={
              <DoctorsPage />
            }
          />

          <Route
            path="/usuarios"
            element={
              <UsersPage />
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