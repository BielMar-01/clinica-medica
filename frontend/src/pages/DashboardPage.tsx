import {
  useAuth,
} from '../hooks/useAuth'

export function DashboardPage() {
  const {
    user,
  } = useAuth()

  return (
    <section
      className="page"
      data-testid="dashboard-page"
    >
      <header
        className="page-header"
        data-testid="dashboard-header"
      >
        <div>
          <h1 data-testid="dashboard-title">
            Dashboard
          </h1>

          <p data-testid="dashboard-welcome-message">
            Bem-vindo,{' '}
            {user?.nome}.
          </p>
        </div>
      </header>

      <div
        className="dashboard-grid"
        data-testid="dashboard-cards"
      >
        <article
          className="dashboard-card"
          data-testid="dashboard-session-card"
        >
          <span>
            Sessão
          </span>

          <strong data-testid="dashboard-session-status">
            Ativa
          </strong>
        </article>

        <article
          className="dashboard-card"
          data-testid="dashboard-role-card"
        >
          <span>
            Perfil
          </span>

          <strong data-testid="dashboard-user-role">
            {user?.perfil}
          </strong>
        </article>

        <article
          className="dashboard-card"
          data-testid="dashboard-patients-card"
        >
          <span>
            Pacientes
          </span>

          <strong data-testid="dashboard-patients-status">
            Módulo disponível
          </strong>
        </article>
      </div>
    </section>
  )
}