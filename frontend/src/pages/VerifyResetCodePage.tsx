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

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3 20 6v5c0 5-3.4 8.6-8 10-4.6-1.4-8-5-8-10V6l8-3Z" />

      <path d="m9 12 2 2 4-4" />
    </svg>
  )
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
      className="login-page auth-flow-page"
      data-testid="verify-reset-code-page"
    >
      <div className="login-background-decoration login-background-decoration-one" />
      <div className="login-background-decoration login-background-decoration-two" />

      <section
        className="auth-flow-card"
        data-testid="verify-reset-code-card"
      >
        <div className="auth-flow-brand">
          <div
            className="login-brand-mark"
            aria-hidden="true"
          >
            +
          </div>

          <div>
            <strong>
              Clínica Médica
            </strong>

            <span>
              Gestão inteligente
            </span>
          </div>
        </div>

        <div
          className="auth-step-indicator"
          data-testid="password-recovery-steps"
        >
          <span className="completed">
            ✓
          </span>

          <i className="completed" />

          <span className="active">
            2
          </span>

          <i />

          <span>
            3
          </span>
        </div>

        <div className="auth-flow-icon">
          <ShieldIcon />
        </div>

        <div
          className="login-header auth-flow-header"
          data-testid="verify-reset-code-header"
        >
          <span className="login-header-eyebrow">
            Verificação de segurança
          </span>

          <h1
            data-testid="verify-reset-code-title"
          >
            Verifique seu e-mail
          </h1>

          <p>
            Digite o código de 6 dígitos
            enviado para{' '}
            <strong
              className="auth-email-highlight"
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
              className="verification-code-input"
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
              aria-describedby="verification-code-hint"
            />
          </label>

          <span
            id="verification-code-hint"
            className="verification-code-hint"
          >
            O código possui 6 números e
            expira após alguns minutos.
          </span>

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
            className="login-submit-button"
            data-testid="verify-reset-code-submit-button"
            type="submit"
            disabled={
              submitting ||
              codigo.length !== 6
            }
          >
            {submitting && (
              <span
                className="login-submit-spinner"
                aria-hidden="true"
              />
            )}

            <span>
              {submitting
                ? 'Verificando...'
                : 'Verificar código'}
            </span>
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