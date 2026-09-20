import {
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react'

import {
  NavLink,
  Outlet,
  useNavigate,
} from 'react-router'

import {
  useAuth,
} from '../hooks/useAuth'

import {
  useTheme,
} from '../hooks/useTheme'

import type {
  ThemePreference,
} from '../types/theme'

type NavigationIconProps = {
  children: ReactNode
}

function NavigationIcon({
  children,
}: NavigationIconProps) {
  return (
    <span
      className="sidebar-nav-icon"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {children}
      </svg>
    </span>
  )
}

function DashboardIcon() {
  return (
    <NavigationIcon>
      <rect
        x="3"
        y="3"
        width="7"
        height="7"
        rx="1.5"
      />

      <rect
        x="14"
        y="3"
        width="7"
        height="7"
        rx="1.5"
      />

      <rect
        x="3"
        y="14"
        width="7"
        height="7"
        rx="1.5"
      />

      <rect
        x="14"
        y="14"
        width="7"
        height="7"
        rx="1.5"
      />
    </NavigationIcon>
  )
}

function PatientsIcon() {
  return (
    <NavigationIcon>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />

      <circle
        cx="9"
        cy="7"
        r="4"
      />

      <path d="M19 8v6" />
      <path d="M22 11h-6" />
    </NavigationIcon>
  )
}

function SpecialtiesIcon() {
  return (
    <NavigationIcon>
      <path d="M12 3v18" />
      <path d="M3 12h18" />

      <rect
        x="5"
        y="5"
        width="14"
        height="14"
        rx="4"
      />
    </NavigationIcon>
  )
}

function DoctorsIcon() {
  return (
    <NavigationIcon>
      <circle
        cx="12"
        cy="7"
        r="4"
      />

      <path d="M5.5 21v-2a6.5 6.5 0 0 1 13 0v2" />

      <path d="M9 14.8v2.2a3 3 0 0 0 6 0v-2.2" />
    </NavigationIcon>
  )
}

function UsersIcon() {
  return (
    <NavigationIcon>
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />

      <circle
        cx="8.5"
        cy="7"
        r="4"
      />

      <path d="M17 11l2 2 4-4" />
    </NavigationIcon>
  )
}

function LogoutIcon() {
  return (
    <NavigationIcon>
      <path d="M10 17l5-5-5-5" />
      <path d="M15 12H3" />
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
    </NavigationIcon>
  )
}

function SunIcon() {
  return (
    <NavigationIcon>
      <circle
        cx="12"
        cy="12"
        r="4"
      />

      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="M4.93 4.93l1.41 1.41" />
      <path d="M17.66 17.66l1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="M6.34 17.66l-1.41 1.41" />
      <path d="M19.07 4.93l-1.41 1.41" />
    </NavigationIcon>
  )
}

function MoonIcon() {
  return (
    <NavigationIcon>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </NavigationIcon>
  )
}

function SystemIcon() {
  return (
    <NavigationIcon>
      <rect
        x="3"
        y="4"
        width="18"
        height="13"
        rx="2"
      />

      <path d="M8 21h8" />
      <path d="M12 17v4" />
    </NavigationIcon>
  )
}

function ChevronIcon() {
  return (
    <NavigationIcon>
      <path d="M6 9l6 6 6-6" />
    </NavigationIcon>
  )
}

function getRoleLabel(
  role: string | undefined,
) {
  switch (role) {
    case 'ADMIN':
      return 'Administrador'

    case 'RECEPCIONISTA':
      return 'Recepção'

    case 'MEDICO':
      return 'Médico'

    default:
      return role ?? ''
  }
}

function getInitials(
  name: string | undefined,
) {
  if (!name) {
    return 'CM'
  }

  const parts =
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean)

  if (parts.length === 0) {
    return 'CM'
  }

  if (parts.length === 1) {
    return parts[0]
      .slice(0, 2)
      .toUpperCase()
  }

  return (
    parts[0][0] +
    parts[parts.length - 1][0]
  ).toUpperCase()
}

function getThemeLabel(
  preference: ThemePreference,
) {
  switch (preference) {
    case 'light':
      return 'Claro'

    case 'dark':
      return 'Escuro'

    default:
      return 'Sistema'
  }
}

function ThemeIcon({
  preference,
}: {
  preference: ThemePreference
}) {
  if (preference === 'light') {
    return <SunIcon />
  }

  if (preference === 'dark') {
    return <MoonIcon />
  }

  return <SystemIcon />
}

export function AppLayout() {
  const navigate =
    useNavigate()

  const {
    user,
    logout,
  } = useAuth()

  const {
    preference,
    changeTheme,
  } = useTheme()

  const [
    themeMenuOpen,
    setThemeMenuOpen,
  ] =
    useState(false)

  const themeMenuRef =
    useRef<HTMLDivElement>(
      null,
    )

  useEffect(
    () => {
      function handleOutsideClick(
        event: MouseEvent,
      ) {
        if (
          themeMenuRef.current &&
          !themeMenuRef.current.contains(
            event.target as Node,
          )
        ) {
          setThemeMenuOpen(false)
        }
      }

      function handleEscape(
        event: KeyboardEvent,
      ) {
        if (
          event.key === 'Escape'
        ) {
          setThemeMenuOpen(false)
        }
      }

      document.addEventListener(
        'mousedown',
        handleOutsideClick,
      )

      document.addEventListener(
        'keydown',
        handleEscape,
      )

      return () => {
        document.removeEventListener(
          'mousedown',
          handleOutsideClick,
        )

        document.removeEventListener(
          'keydown',
          handleEscape,
        )
      }
    },
    [],
  )

  async function handleLogout() {
    await logout()

    navigate(
      '/login',
      {
        replace: true,
      },
    )
  }

  function handleThemeChange(
    nextTheme: ThemePreference,
  ) {
    changeTheme(
      nextTheme,
    )

    setThemeMenuOpen(
      false,
    )
  }

  const isAdmin =
    user?.perfil === 'ADMIN'

  const userInitials =
    getInitials(
      user?.nome,
    )

  const roleLabel =
    getRoleLabel(
      user?.perfil,
    )

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
          <div
            className="sidebar-brand-mark"
            aria-hidden="true"
          >
            <span>+</span>
          </div>

          <div className="sidebar-brand-content">
            <strong
              data-testid="sidebar-brand-title"
            >
              Clínica Médica
            </strong>

            <span
              data-testid="sidebar-brand-description"
            >
              Gestão inteligente
            </span>
          </div>
        </div>

        <div className="sidebar-section">
          <span className="sidebar-section-label">
            Visão geral
          </span>

          <nav
            className="sidebar-nav"
            data-testid="sidebar-navigation"
          >
            <NavLink
              to="/dashboard"
              data-testid="nav-dashboard-link"
            >
              <DashboardIcon />

              <span>
                Dashboard
              </span>
            </NavLink>
          </nav>
        </div>

        <div className="sidebar-section">
          <span className="sidebar-section-label">
            Gestão clínica
          </span>

          <nav className="sidebar-nav">
            <NavLink
              to="/pacientes"
              data-testid="nav-patients-link"
            >
              <PatientsIcon />

              <span>
                Pacientes
              </span>
            </NavLink>

            <NavLink
              to="/especialidades"
              data-testid="nav-specialties-link"
            >
              <SpecialtiesIcon />

              <span>
                Especialidades
              </span>
            </NavLink>

            <NavLink
              to="/medicos"
              data-testid="nav-doctors-link"
            >
              <DoctorsIcon />

              <span>
                Médicos
              </span>
            </NavLink>
          </nav>
        </div>

        {isAdmin && (
          <div className="sidebar-section">
            <span className="sidebar-section-label">
              Administração
            </span>

            <nav className="sidebar-nav">
              <NavLink
                to="/usuarios"
                data-testid="nav-users-link"
              >
                <UsersIcon />

                <span>
                  Usuários
                </span>
              </NavLink>
            </nav>
          </div>
        )}

        <div
          className="sidebar-user"
          data-testid="sidebar-user-section"
        >
          <div className="sidebar-user-profile">
            <div
              className="sidebar-user-avatar"
              aria-hidden="true"
            >
              {userInitials}
            </div>

            <div className="sidebar-user-info">
              <strong
                data-testid="sidebar-user-name"
              >
                {user?.nome}
              </strong>

              <span
                data-testid="sidebar-user-role"
              >
                {roleLabel}
              </span>
            </div>
          </div>

          <button
            className="sidebar-logout"
            data-testid="logout-button"
            type="button"
            onClick={
              handleLogout
            }
          >
            <LogoutIcon />

            <span>
              Sair do sistema
            </span>
          </button>
        </div>
      </aside>

      <div className="app-main">
        <header
          className="app-topbar"
          data-testid="app-topbar"
        >
          <div className="app-topbar-context">
            <span className="app-topbar-eyebrow">
              Sistema clínico
            </span>

            <strong>
              Gestão da clínica
            </strong>
          </div>

          <div className="app-topbar-actions">
            <div
              className="theme-selector"
              ref={
                themeMenuRef
              }
            >
              <button
                className="theme-selector-trigger"
                data-testid="theme-selector-button"
                type="button"
                aria-haspopup="menu"
                aria-expanded={
                  themeMenuOpen
                }
                onClick={
                  () =>
                    setThemeMenuOpen(
                      (current) =>
                        !current,
                    )
                }
              >
                <ThemeIcon
                  preference={
                    preference
                  }
                />

                <span>
                  {getThemeLabel(
                    preference,
                  )}
                </span>

                <ChevronIcon />
              </button>

              {themeMenuOpen && (
                <div
                  className="theme-menu"
                  role="menu"
                  data-testid="theme-selector-menu"
                >
                  <button
                    type="button"
                    role="menuitem"
                    className={
                      preference ===
                      'system'
                        ? 'active'
                        : ''
                    }
                    data-testid="theme-system-option"
                    onClick={
                      () =>
                        handleThemeChange(
                          'system',
                        )
                    }
                  >
                    <SystemIcon />

                    <span>
                      <strong>
                        Sistema
                      </strong>

                      <small>
                        Acompanha seu dispositivo
                      </small>
                    </span>
                  </button>

                  <button
                    type="button"
                    role="menuitem"
                    className={
                      preference ===
                      'light'
                        ? 'active'
                        : ''
                    }
                    data-testid="theme-light-option"
                    onClick={
                      () =>
                        handleThemeChange(
                          'light',
                        )
                    }
                  >
                    <SunIcon />

                    <span>
                      <strong>
                        Claro
                      </strong>

                      <small>
                        Sempre usar tema claro
                      </small>
                    </span>
                  </button>

                  <button
                    type="button"
                    role="menuitem"
                    className={
                      preference ===
                      'dark'
                        ? 'active'
                        : ''
                    }
                    data-testid="theme-dark-option"
                    onClick={
                      () =>
                        handleThemeChange(
                          'dark',
                        )
                    }
                  >
                    <MoonIcon />

                    <span>
                      <strong>
                        Escuro
                      </strong>

                      <small>
                        Sempre usar tema escuro
                      </small>
                    </span>
                  </button>
                </div>
              )}
            </div>

            <div
              className="topbar-user"
              data-testid="topbar-user"
            >
              <div
                className="topbar-user-avatar"
                aria-hidden="true"
              >
                {userInitials}
              </div>

              <div className="topbar-user-info">
                <strong>
                  {user?.nome}
                </strong>

                <span>
                  {roleLabel}
                </span>
              </div>
            </div>
          </div>
        </header>

        <main
          className="app-content"
          data-testid="app-content"
        >
          <Outlet />
        </main>
      </div>
    </div>
  )
}