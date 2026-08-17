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
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <strong>
            Clínica Médica
          </strong>

          <span>
            Gestão clínica
          </span>
        </div>

        <nav className="sidebar-nav">
          <NavLink
            to="/dashboard"
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/pacientes"
          >
            Pacientes
          </NavLink>
        </nav>

        <div className="sidebar-user">
          <div>
            <strong>
              {user?.nome}
            </strong>

            <span>
              {user?.perfil}
            </span>
          </div>

          <button
            type="button"
            onClick={
              handleLogout
            }
          >
            Sair
          </button>
        </div>
      </aside>

      <main className="app-content">
        <Outlet />
      </main>
    </div>
  )
}