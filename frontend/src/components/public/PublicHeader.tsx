import {
  Link,
  NavLink,
} from 'react-router'

export function PublicHeader() {
  return (
    <header
      className="public-header"
      data-testid="public-header"
    >
      <div className="public-header-container">
        <Link
          to="/"
          className="public-brand"
          aria-label="Clínica Médica - Página inicial"
          data-testid="public-brand-link"
        >
          <span
            className="public-brand-symbol"
            aria-hidden="true"
          >
            +
          </span>

          <span className="public-brand-content">
            <strong>
              Clínica Médica
            </strong>

            <small>
              Cuidado e tecnologia
            </small>
          </span>
        </Link>

        <nav
          className="public-navigation"
          aria-label="Navegação principal"
          data-testid="public-navigation"
        >
          <NavLink
            to="/"
            end
            data-testid="public-nav-home"
          >
            Início
          </NavLink>

          <NavLink
            to="/especialidades-clinicas"
            data-testid="public-nav-specialties"
          >
            Especialidades
          </NavLink>

          <NavLink
            to="/corpo-clinico"
            data-testid="public-nav-doctors"
          >
            Corpo clínico
          </NavLink>
        </nav>

        <div className="public-header-actions">
          <Link
            to="/login"
            className="secondary-button"
            data-testid="public-login-button"
          >
            Área do profissional
          </Link>
        </div>
      </div>
    </header>
  )
}