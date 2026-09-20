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
  resetPasswordRequest,
} from '../services/auth.service'

type ResetPasswordLocationState = {
  resetToken?: string
}

function EyeIcon({
  visible,
}: {
  visible: boolean
}) {
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
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />

      <circle
        cx="12"
        cy="12"
        r="3"
      />

      {visible && (
        <path d="M4 4l16 16" />
      )}
    </svg>
  )
}

function LockIcon() {
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
        x="5"
        y="11"
        width="14"
        height="10"
        rx="2"
      />

      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  )
}

function SuccessIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
      />

      <path d="m8 12 2.5 2.5L16 9" />
    </svg>
  )
}

export function ResetPasswordPage() {
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
      | ResetPasswordLocationState
      | null

  const resetToken =
    state?.resetToken ?? ''

  const [
    novaSenha,
    setNovaSenha,
  ] = useState('')

  const [
    confirmarSenha,
    setConfirmarSenha,
  ] = useState('')

  const [
    showNewPassword,
    setShowNewPassword,
  ] = useState(false)

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false)

  const [
    error,
    setError,
  ] = useState('')

  const [
    submitting,
    setSubmitting,
  ] = useState(false)

  const [
    success,
    setSuccess,
  ] = useState(false)

  const passwordRules = {
    minimum:
      novaSenha.length >= 8,

    uppercase:
      /[A-Z]/.test(
        novaSenha,
      ),

    lowercase:
      /[a-z]/.test(
        novaSenha,
      ),

    number:
      /\d/.test(
        novaSenha,
      ),

    special:
      /[^A-Za-z0-9]/.test(
        novaSenha,
      ),
  }

  const passwordValid =
    Object
      .values(passwordRules)
      .every(Boolean)

  const passwordsMatch =
    confirmarSenha.length > 0 &&
    novaSenha === confirmarSenha

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

  if (!resetToken) {
    return (
      <Navigate
        to="/forgot-password"
        replace
      />
    )
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    if (!passwordValid) {
      setError(
        'A nova senha não atende aos requisitos de segurança.',
      )

      return
    }

    if (
      novaSenha !==
      confirmarSenha
    ) {
      setError(
        'As senhas não coincidem.',
      )

      return
    }

    try {
      setError('')
      setSubmitting(true)

      await resetPasswordRequest({
        resetToken,
        novaSenha,
        confirmarSenha,
      })

      setSuccess(true)
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Erro ao redefinir senha'

      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  function handleGoToLogin() {
    navigate(
      '/login',
      {
        replace: true,
      },
    )
  }

  if (success) {
    return (
      <main
        className="login-page auth-flow-page"
        data-testid="reset-password-success-page"
      >
        <div className="login-background-decoration login-background-decoration-one" />
        <div className="login-background-decoration login-background-decoration-two" />

        <section
          className="auth-flow-card auth-success-card"
          data-testid="reset-password-success-card"
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
            className="auth-success-icon"
            aria-hidden="true"
          >
            <SuccessIcon />
          </div>

          <div
            className="login-header auth-flow-header"
            data-testid="reset-password-success-header"
          >
            <span className="login-header-eyebrow">
              Recuperação concluída
            </span>

            <h1
              data-testid="reset-password-success-title"
            >
              Senha redefinida
            </h1>

            <p
              data-testid="reset-password-success-message"
            >
              Sua senha foi alterada com
              sucesso. Agora você pode acessar
              sua conta utilizando a nova senha.
            </p>
          </div>

          <button
            className="login-submit-button"
            type="button"
            onClick={handleGoToLogin}
            data-testid="reset-password-login-button"
          >
            Ir para o login
          </button>
        </section>
      </main>
    )
  }

  return (
    <main
      className="login-page auth-flow-page"
      data-testid="reset-password-page"
    >
      <div className="login-background-decoration login-background-decoration-one" />
      <div className="login-background-decoration login-background-decoration-two" />

      <section
        className="auth-flow-card"
        data-testid="reset-password-card"
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

          <span className="completed">
            ✓
          </span>

          <i className="completed" />

          <span className="active">
            3
          </span>
        </div>

        <div className="auth-flow-icon">
          <LockIcon />
        </div>

        <div
          className="login-header auth-flow-header"
          data-testid="reset-password-header"
        >
          <span className="login-header-eyebrow">
            Nova credencial
          </span>

          <h1
            data-testid="reset-password-title"
          >
            Crie uma nova senha
          </h1>

          <p
            data-testid="reset-password-description"
          >
            Escolha uma senha segura para
            concluir a recuperação da sua conta.
          </p>
        </div>

        <form
          className="login-form"
          onSubmit={handleSubmit}
          data-testid="reset-password-form"
        >
          <label>
            Nova senha

            <div className="password-input-wrapper">
              <input
                data-testid="reset-password-new-password-input"
                type={
                  showNewPassword
                    ? 'text'
                    : 'password'
                }
                value={novaSenha}
                onChange={(event) => {
                  setNovaSenha(
                    event.target.value,
                  )

                  if (error) {
                    setError('')
                  }
                }}
                placeholder="Digite sua nova senha"
                required
                minLength={8}
                autoComplete="new-password"
                disabled={submitting}
              />

              <button
                className="password-visibility-button"
                data-testid="reset-password-new-password-visibility-button"
                type="button"
                aria-label={
                  showNewPassword
                    ? 'Ocultar nova senha'
                    : 'Mostrar nova senha'
                }
                aria-pressed={showNewPassword}
                disabled={submitting}
                onClick={
                  () =>
                    setShowNewPassword(
                      (current) =>
                        !current,
                    )
                }
              >
                <EyeIcon
                  visible={showNewPassword}
                />
              </button>
            </div>
          </label>

          <div
            className="password-requirements"
            data-testid="reset-password-requirements"
          >
            <span>
              Sua senha deve conter:
            </span>

            <ul>
              <li
                className={
                  passwordRules.minimum
                    ? 'valid'
                    : ''
                }
              >
                <span>✓</span>
                8 ou mais caracteres
              </li>

              <li
                className={
                  passwordRules.uppercase
                    ? 'valid'
                    : ''
                }
              >
                <span>✓</span>
                Uma letra maiúscula
              </li>

              <li
                className={
                  passwordRules.lowercase
                    ? 'valid'
                    : ''
                }
              >
                <span>✓</span>
                Uma letra minúscula
              </li>

              <li
                className={
                  passwordRules.number
                    ? 'valid'
                    : ''
                }
              >
                <span>✓</span>
                Um número
              </li>

              <li
                className={
                  passwordRules.special
                    ? 'valid'
                    : ''
                }
              >
                <span>✓</span>
                Um caractere especial
              </li>
            </ul>
          </div>

          <label>
            Confirmar nova senha

            <div className="password-input-wrapper">
              <input
                data-testid="reset-password-confirm-password-input"
                type={
                  showConfirmPassword
                    ? 'text'
                    : 'password'
                }
                value={confirmarSenha}
                onChange={(event) => {
                  setConfirmarSenha(
                    event.target.value,
                  )

                  if (error) {
                    setError('')
                  }
                }}
                placeholder="Confirme sua nova senha"
                required
                minLength={8}
                autoComplete="new-password"
                disabled={submitting}
              />

              <button
                className="password-visibility-button"
                data-testid="reset-password-confirm-password-visibility-button"
                type="button"
                aria-label={
                  showConfirmPassword
                    ? 'Ocultar confirmação da senha'
                    : 'Mostrar confirmação da senha'
                }
                aria-pressed={showConfirmPassword}
                disabled={submitting}
                onClick={
                  () =>
                    setShowConfirmPassword(
                      (current) =>
                        !current,
                    )
                }
              >
                <EyeIcon
                  visible={showConfirmPassword}
                />
              </button>
            </div>
          </label>

          {confirmarSenha && (
            <span
              className={
                passwordsMatch
                  ? 'password-match valid'
                  : 'password-match invalid'
              }
              data-testid="reset-password-match-status"
            >
              {passwordsMatch
                ? '✓ As senhas coincidem.'
                : 'As senhas ainda não coincidem.'}
            </span>
          )}

          {error && (
            <div
              className="form-error"
              role="alert"
              data-testid="reset-password-error-message"
            >
              {error}
            </div>
          )}

          <button
            className="login-submit-button"
            data-testid="reset-password-submit-button"
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
                ? 'Redefinindo...'
                : 'Redefinir senha'}
            </span>
          </button>
        </form>

        <div
          className="auth-card-footer"
          data-testid="reset-password-footer"
        >
          <Link
            to="/login"
            data-testid="reset-password-back-login-link"
          >
            ← Voltar para o login
          </Link>
        </div>
      </section>
    </main>
  )
}