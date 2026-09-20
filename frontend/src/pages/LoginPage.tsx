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

function CheckIcon() {
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
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
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

export function LoginPage() {
  const navigate =
    useNavigate()

  const {
    login,
    isAuthenticated,
    isLoading,
  } = useAuth()

  const [
    email,
    setEmail,
  ] = useState('')

  const [
    senha,
    setSenha,
  ] = useState('')

  const [
    showPassword,
    setShowPassword,
  ] = useState(false)

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

      await login({
        email,
        senha,
      })

      navigate(
        '/dashboard',
        {
          replace: true,
        },
      )
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Erro ao realizar login'

      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main
      className="login-page"
      data-testid="login-page"
    >
      <div className="login-background-decoration login-background-decoration-one" />
      <div className="login-background-decoration login-background-decoration-two" />

      <section
        className="login-shell"
        data-testid="login-card"
      >
        <aside
          className="login-brand-panel"
          data-testid="login-brand-panel"
        >
          <div className="login-brand-top">
            <div className="login-brand">
              <div
                className="login-brand-mark"
                aria-hidden="true"
              >
                +
              </div>

              <div className="login-brand-name">
                <strong>
                  Clínica Médica
                </strong>

                <span>
                  Gestão inteligente
                </span>
              </div>
            </div>

            <div className="login-brand-content">
              <span className="login-brand-eyebrow">
                Plataforma de gestão clínica
              </span>

              <h2>
                Gestão clínica mais simples,
                conectada e inteligente.
              </h2>

              <p>
                Centralize sua operação em uma
                experiência segura, moderna e
                preparada para acompanhar a rotina
                da clínica.
              </p>
            </div>
          </div>

          <div className="login-benefits">
            <div className="login-benefit">
              <span className="login-benefit-icon">
                <CheckIcon />
              </span>

              <div>
                <strong>
                  Gestão centralizada
                </strong>

                <span>
                  Informações importantes em um
                  único ambiente.
                </span>
              </div>
            </div>

            <div className="login-benefit">
              <span className="login-benefit-icon">
                <CheckIcon />
              </span>

              <div>
                <strong>
                  Operação segura
                </strong>

                <span>
                  Controle de acesso e proteção
                  para os dados da clínica.
                </span>
              </div>
            </div>

            <div className="login-benefit">
              <span className="login-benefit-icon">
                <CheckIcon />
              </span>

              <div>
                <strong>
                  Experiência eficiente
                </strong>

                <span>
                  Fluxos pensados para simplificar
                  o trabalho da equipe.
                </span>
              </div>
            </div>
          </div>

          <span className="login-brand-footer">
            Clínica Médica · Galera do TI
          </span>
        </aside>

        <div className="login-form-panel">
          <div className="login-mobile-brand">
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
            className="login-header"
            data-testid="login-header"
          >
            <span className="login-header-eyebrow">
              Acesso ao sistema
            </span>

            <h1
              data-testid="login-title"
            >
              Bem-vindo de volta
            </h1>

            <p
              data-testid="login-description"
            >
              Informe suas credenciais para acessar
              o ambiente de gestão da clínica.
            </p>
          </div>

          <form
            className="login-form"
            onSubmit={handleSubmit}
            data-testid="login-form"
          >
            <label>
              E-mail

              <input
                data-testid="login-email-input"
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

            <label>
              Senha

              <div className="password-input-wrapper">
                <input
                  data-testid="login-password-input"
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  value={senha}
                  onChange={(event) =>
                    setSenha(
                      event.target.value,
                    )
                  }
                  placeholder="Digite sua senha"
                  required
                  autoComplete="current-password"
                  disabled={submitting}
                />

                <button
                  className="password-visibility-button"
                  data-testid="login-password-visibility-button"
                  type="button"
                  aria-label={
                    showPassword
                      ? 'Ocultar senha'
                      : 'Mostrar senha'
                  }
                  aria-pressed={showPassword}
                  disabled={submitting}
                  onClick={
                    () =>
                      setShowPassword(
                        (current) =>
                          !current,
                      )
                  }
                >
                  <EyeIcon
                    visible={showPassword}
                  />
                </button>
              </div>
            </label>

            <div
              className="login-password-actions"
              data-testid="login-password-actions"
            >
              <Link
                to="/forgot-password"
                data-testid="login-forgot-password-link"
              >
                Esqueci minha senha
              </Link>
            </div>

            {error && (
              <div
                className="form-error"
                role="alert"
                data-testid="login-error-message"
              >
                {error}
              </div>
            )}

            <button
              className="login-submit-button"
              data-testid="login-submit-button"
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
                  ? 'Entrando...'
                  : 'Entrar'}
              </span>
            </button>
          </form>

          <div className="login-security-message">
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

            <span>
              Ambiente seguro e protegido
            </span>
          </div>
        </div>
      </section>
    </main>
  )
}