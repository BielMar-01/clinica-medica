import {
  useState,
  type FormEvent,
} from 'react'

import {
  Link,
  Navigate,
  useNavigate,
} from 'react-router'

import {
  useAuth,
} from '../hooks/useAuth'

import {
  forgotPasswordRequest,
} from '../services/auth.service'

function MailIcon() {
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
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
      />

      <path d="m3 7 9 6 9-6" />
    </svg>
  )
}

export function ForgotPasswordPage() {
  const navigate =
    useNavigate()

  const {
    isAuthenticated,
    isLoading,
  } = useAuth()

  const [
    email,
    setEmail,
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

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    try {
      setError('')
      setSubmitting(true)

      const normalizedEmail =
        email
          .trim()
          .toLowerCase()

      await forgotPasswordRequest(
        normalizedEmail,
      )

      navigate(
        '/verify-reset-code',
        {
          state: {
            email:
              normalizedEmail,
          },
        },
      )
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Erro ao solicitar recuperação de senha'

      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main
      className="login-page auth-flow-page"
      data-testid="forgot-password-page"
    >
      <div className="login-background-decoration login-background-decoration-one" />
      <div className="login-background-decoration login-background-decoration-two" />

      <section
        className="auth-flow-card"
        data-testid="forgot-password-card"
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
          <span className="active">
            1
          </span>

          <i />

          <span>
            2
          </span>

          <i />

          <span>
            3
          </span>
        </div>

        <div className="auth-flow-icon">
          <MailIcon />
        </div>

        <div
          className="login-header auth-flow-header"
          data-testid="forgot-password-header"
        >
          <span className="login-header-eyebrow">
            Recuperação de acesso
          </span>

          <h1
            data-testid="forgot-password-title"
          >
            Esqueceu sua senha?
          </h1>

          <p
            data-testid="forgot-password-description"
          >
            Informe o e-mail da sua conta.
            Enviaremos um código de 6 dígitos
            para continuar a recuperação.
          </p>
        </div>

        <form
          className="login-form"
          onSubmit={handleSubmit}
          data-testid="forgot-password-form"
        >
          <label>
            E-mail

            <input
              data-testid="forgot-password-email-input"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(
                  event.target.value,
                )

                if (error) {
                  setError('')
                }
              }}
              placeholder="seu@email.com"
              required
              autoComplete="email"
              disabled={submitting}
            />
          </label>

          {error && (
            <div
              className="form-error"
              role="alert"
              data-testid="forgot-password-error-message"
            >
              {error}
            </div>
          )}

          <button
            className="login-submit-button"
            data-testid="forgot-password-submit-button"
            type="submit"
            disabled={submitting}
          >
            {submitting && (
              <span
                className="login-submit-spinner"
                aria-hidden="true"
              />
            )}

            <span>
              {submitting
                ? 'Enviando...'
                : 'Enviar código'}
            </span>
          </button>
        </form>

        <div
          className="auth-card-footer"
          data-testid="forgot-password-footer"
        >
          <Link
            to="/login"
            data-testid="forgot-password-back-login-link"
          >
            ← Voltar para o login
          </Link>
        </div>
      </section>
    </main>
  )
}