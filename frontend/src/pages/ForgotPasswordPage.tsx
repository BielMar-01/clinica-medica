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
      className="login-page"
      data-testid="forgot-password-page"
    >
      <section
        className="login-card"
        data-testid="forgot-password-card"
      >
        <div
          className="login-header"
          data-testid="forgot-password-header"
        >
          <h1
            data-testid="forgot-password-title"
          >
            Esqueceu sua senha?
          </h1>

          <p
            data-testid="forgot-password-description"
          >
            Informe o e-mail da sua conta.
            Enviaremos um código de
            verificação para redefinir sua
            senha.
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
              onChange={(event) =>
                setEmail(
                  event.target.value,
                )
              }
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
            data-testid="forgot-password-submit-button"
            type="submit"
            disabled={submitting}
          >
            {submitting
              ? 'Enviando...'
              : 'Enviar código'}
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
            Voltar para o login
          </Link>
        </div>
      </section>
    </main>
  )
}