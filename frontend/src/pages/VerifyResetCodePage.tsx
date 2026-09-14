import {
  useState,
  type FormEvent,
} from 'react'

import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
} from 'react-router'

import {
  useAuth,
} from '../hooks/useAuth'

import {
  verifyResetCodeRequest,
} from '../services/auth.service'

type VerifyResetCodeLocationState = {
  email?: string
}

export function VerifyResetCodePage() {
  const navigate =
    useNavigate()

  const location =
    useLocation()

  const {
    isAuthenticated,
    isLoading,
  } = useAuth()

  const state =
    location.state as
      | VerifyResetCodeLocationState
      | null

  const email =
    state?.email ?? ''

  const [
    codigo,
    setCodigo,
  ] = useState('')

  const [
    error,
    setError,
  ] = useState('')

  const [
    submitting,
    setSubmitting,
  ] = useState(false)

  if (
    !isLoading &&
    isAuthenticated
  ) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    )
  }

  if (!email) {
    return (
      <Navigate
        to="/forgot-password"
        replace
      />
    )
  }

  function handleCodeChange(
    value: string,
  ) {
    const onlyNumbers =
      value.replace(
        /\D/g,
        '',
      )

    setCodigo(
      onlyNumbers.slice(
        0,
        6,
      ),
    )

    if (error) {
      setError('')
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    if (codigo.length !== 6) {
      setError(
        'Informe o código de 6 dígitos.',
      )
      return
    }

    try {
      setError('')
      setSubmitting(true)

      const result =
        await verifyResetCodeRequest({
          email,
          codigo,
        })

      navigate(
        '/reset-password',
        {
          state: {
            resetToken:
              result.resetToken,
          },
        },
      )
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Erro ao verificar código'

      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main
      className="login-page"
      data-testid="verify-reset-code-page"
    >
      <section
        className="login-card"
        data-testid="verify-reset-code-card"
      >
        <div
          className="login-header"
          data-testid="verify-reset-code-header"
        >
          <h1
            data-testid="verify-reset-code-title"
          >
            Verifique seu e-mail
          </h1>

          <p>
            Digite o código de 6 dígitos
            enviado para{' '}
            <strong
              data-testid="verify-reset-code-email"
            >
              {email}
            </strong>
            .
          </p>
        </div>

        <form
          className="login-form"
          onSubmit={handleSubmit}
          data-testid="verify-reset-code-form"
        >
          <label>
            Código de verificação

            <input
              data-testid="verify-reset-code-input"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={codigo}
              onChange={(event) =>
                handleCodeChange(
                  event.target.value,
                )
              }
              placeholder="000000"
              autoComplete="one-time-code"
              disabled={submitting}
              required
            />
          </label>

          {error && (
            <div
              className="form-error"
              role="alert"
              data-testid="verify-reset-code-error-message"
            >
              {error}
            </div>
          )}

          <button
            data-testid="verify-reset-code-submit-button"
            type="submit"
            disabled={
              submitting ||
              codigo.length !== 6
            }
          >
            {submitting
              ? 'Verificando...'
              : 'Verificar código'}
          </button>
        </form>

        <div
          className="auth-card-footer"
          data-testid="verify-reset-code-footer"
        >
          <Link
            to="/forgot-password"
            data-testid="verify-reset-code-back-link"
          >
            Solicitar novo código
          </Link>
        </div>
      </section>
    </main>
  )
}