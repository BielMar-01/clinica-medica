import {
  useState,
  type FormEvent,
} from 'react'

import {
  Navigate,
  useNavigate,
} from 'react-router'

import {
  useAuth,
} from '../hooks/useAuth'

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
    <main className="login-page">
      <section className="login-card">
        <div className="login-header">
          <h1>
            Clínica Médica
          </h1>

          <p>
            Entre para acessar
            o sistema.
          </p>
        </div>

        <form
          className="login-form"
          onSubmit={
            handleSubmit
          }
        >
          <label>
            E-mail

            <input
              type="email"
              value={email}
              onChange={(
                event,
              ) =>
                setEmail(
                  event
                    .target
                    .value,
                )
              }
              placeholder="seu@email.com"
              required
              autoComplete="email"
            />
          </label>

          <label>
            Senha

            <input
              type="password"
              value={senha}
              onChange={(
                event,
              ) =>
                setSenha(
                  event
                    .target
                    .value,
                )
              }
              placeholder="Sua senha"
              required
              autoComplete="current-password"
            />
          </label>

          {error && (
            <div
              className="form-error"
              role="alert"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={
              submitting
            }
          >
            {submitting
              ? 'Entrando...'
              : 'Entrar'}
          </button>
        </form>
      </section>
    </main>
  )
}