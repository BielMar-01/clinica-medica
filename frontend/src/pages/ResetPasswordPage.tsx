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

    if (novaSenha.length < 8) {
      setError(
        'A nova senha deve possuir pelo menos 8 caracteres.',
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
        className="login-page"
        data-testid="reset-password-success-page"
      >
        <section
          className="login-card"
          data-testid="reset-password-success-card"
        >
          <div
            className="login-header"
            data-testid="reset-password-success-header"
          >
            <h1
              data-testid="reset-password-success-title"
            >
              Senha redefinida
            </h1>

            <p
              data-testid="reset-password-success-message"
            >
              Sua senha foi alterada com
              sucesso. Agora você pode entrar
              utilizando a nova senha.
            </p>
          </div>

          <div
            className="login-form"
          >
            <button
              type="button"
              onClick={
                handleGoToLogin
              }
              data-testid="reset-password-login-button"
            >
              Ir para o login
            </button>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main
      className="login-page"
      data-testid="reset-password-page"
    >
      <section
        className="login-card"
        data-testid="reset-password-card"
      >
        <div
          className="login-header"
          data-testid="reset-password-header"
        >
          <h1
            data-testid="reset-password-title"
          >
            Crie uma nova senha
          </h1>

          <p
            data-testid="reset-password-description"
          >
            Informe sua nova senha para
            concluir a recuperação da conta.
          </p>
        </div>

        <form
          className="login-form"
          onSubmit={handleSubmit}
          data-testid="reset-password-form"
        >
          <label>
            Nova senha

            <input
              data-testid="reset-password-new-password-input"
              type="password"
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
          </label>

          <label>
            Confirmar nova senha

            <input
              data-testid="reset-password-confirm-password-input"
              type="password"
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
          </label>

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
            data-testid="reset-password-submit-button"
            type="submit"
            disabled={submitting}
          >
            {submitting
              ? 'Redefinindo...'
              : 'Redefinir senha'}
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
            Voltar para o login
          </Link>
        </div>
      </section>
    </main>
  )
}