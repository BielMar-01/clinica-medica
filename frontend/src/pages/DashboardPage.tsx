import {
  useAuth,
} from '../hooks/useAuth'

export function DashboardPage() {
  const {
    user,
  } = useAuth()

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <h1>
            Dashboard
          </h1>

          <p>
            Bem-vindo,
            {' '}
            {user?.nome}.
          </p>
        </div>
      </header>

      <div className="dashboard-grid">
        <article className="dashboard-card">
          <span>
            Sessão
          </span>

          <strong>
            Ativa
          </strong>
        </article>

        <article className="dashboard-card">
          <span>
            Perfil
          </span>

          <strong>
            {user?.perfil}
          </strong>
        </article>

        <article className="dashboard-card">
          <span>
            Pacientes
          </span>

          <strong>
            Módulo disponível
          </strong>
        </article>
      </div>
    </section>
  )
}