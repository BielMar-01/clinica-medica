import {
  NavLink,
  Outlet,
  useNavigate,
} from 'react-router'

import {
  useAuth,
} from '../hooks/useAuth'

export function AppLayout() {
  const navigate =
    useNavigate()

  const {
    user,
    logout,
  } = useAuth()

  async function handleLogout() {
    await logout()

    navigate(
      '/login',
      {
        replace: true,
      },
    )
  }

  return (
    <div
      className="app-layout"
      data-testid="app-layout"
    >
      <aside
        className="sidebar"
        data-testid="app-sidebar"
      >
        <div
          className="sidebar-brand"
          data-testid="sidebar-brand"
        >
          <strong data-testid="sidebar-brand-title">
            Clínica Médica
          </strong>

          <span data-testid="sidebar-brand-description">
            Gestão clínica
          </span>
        </div>

        <nav
          className="sidebar-nav"
          data-testid="sidebar-navigation"
        >
          <NavLink
            to="/dashboard"
            data-testid="nav-dashboard-link"
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/pacientes"
            data-testid="nav-patients-link"
          >
            Pacientes
          </NavLink>
        </nav>

        <div
          className="sidebar-user"
          data-testid="sidebar-user-section"
        >
          <div>
            <strong data-testid="sidebar-user-name">
              {user?.nome}
            </strong>

            <span data-testid="sidebar-user-role">
              {user?.perfil}
            </span>
          </div>

          <button
            data-testid="logout-button"
            type="button"
            onClick={handleLogout}
          >
            Sair
          </button>
        </div>
      </aside>

      <main
        className="app-content"
        data-testid="app-content"
      >
        <Outlet />
      </main>
    </div>
  )
}