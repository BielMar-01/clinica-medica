import {
  useEffect,
  useState,
} from 'react'

import {
  Link,
  NavLink,
} from 'react-router'

export function PublicHeader() {
  const [
    menuOpen,
    setMenuOpen,
  ] =
    useState(false)

  function closeMenu() {
    setMenuOpen(false)
  }

  useEffect(() => {
    if (!menuOpen) {
      return
    }

    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (
        event.key === 'Escape'
      ) {
        setMenuOpen(false)
      }
    }

    const previousOverflow =
      document.body.style.overflow

    document.body.style.overflow =
      'hidden'

    window.addEventListener(
      'keydown',
      handleKeyDown,
    )

    return () => {
      document.body.style.overflow =
        previousOverflow

      window.removeEventListener(
        'keydown',
        handleKeyDown,
      )
    }
  }, [
    menuOpen,
  ])

  return (
    <>
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
              className="secondary-button public-professional-button"
              data-testid="public-login-button"
            >
              Área do profissional
            </Link>

            <button
              type="button"
              className="public-menu-button"
              aria-label="Abrir menu"
              aria-expanded={
                menuOpen
              }
              aria-controls="public-mobile-navigation"
              onClick={() =>
                setMenuOpen(true)
              }
              data-testid="public-menu-button"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <button
        type="button"
        className={`public-menu-overlay ${
          menuOpen
            ? 'public-menu-overlay-visible'
            : ''
        }`}
        aria-label="Fechar menu"
        tabIndex={
          menuOpen
            ? 0
            : -1
        }
        onClick={
          closeMenu
        }
        data-testid="public-menu-overlay"
      />

      <aside
        id="public-mobile-navigation"
        className={`public-mobile-menu ${
          menuOpen
            ? 'public-mobile-menu-open'
            : ''
        }`}
        aria-hidden={
          !menuOpen
        }
        data-testid="public-mobile-menu"
      >
        <div className="public-mobile-menu-header">
          <Link
            to="/"
            className="public-brand"
            tabIndex={
              menuOpen
                ? 0
                : -1
            }
            onClick={
              closeMenu
            }
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

          <button
            type="button"
            className="public-menu-close"
            aria-label="Fechar menu"
            onClick={
              closeMenu
            }
            tabIndex={
              menuOpen
                ? 0
                : -1
            }
            data-testid="public-menu-close-button"
          >
            ×
          </button>
        </div>

        <nav
          className="public-mobile-navigation"
          aria-label="Navegação mobile"
        >
          <NavLink
            to="/"
            end
            tabIndex={
              menuOpen
                ? 0
                : -1
            }
            onClick={
              closeMenu
            }
            data-testid="public-mobile-nav-home"
          >
            <span>
              Início
            </span>

            <small>
              Página inicial
            </small>
          </NavLink>

          <NavLink
            to="/especialidades-clinicas"
            tabIndex={
              menuOpen
                ? 0
                : -1
            }
            onClick={
              closeMenu
            }
            data-testid="public-mobile-nav-specialties"
          >
            <span>
              Especialidades
            </span>

            <small>
              Conheça nossas áreas de cuidado
            </small>
          </NavLink>

          <NavLink
            to="/corpo-clinico"
            tabIndex={
              menuOpen
                ? 0
                : -1
            }
            onClick={
              closeMenu
            }
            data-testid="public-mobile-nav-doctors"
          >
            <span>
              Corpo clínico
            </span>

            <small>
              Conheça nossos profissionais
            </small>
          </NavLink>
        </nav>

        <div className="public-mobile-menu-footer">
          <p>
            Já faz parte da equipe?
          </p>

          <Link
            to="/login"
            className="primary-button"
            tabIndex={
              menuOpen
                ? 0
                : -1
            }
            onClick={
              closeMenu
            }
            data-testid="public-mobile-login-button"
          >
            Acessar área profissional
          </Link>
        </div>
      </aside>
    </>
  )
}