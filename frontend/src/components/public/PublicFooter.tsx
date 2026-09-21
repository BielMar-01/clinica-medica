import {
  Link,
} from 'react-router'

export function PublicFooter() {
  const currentYear =
    new Date().getFullYear()

  return (
    <footer
      className="public-footer"
      data-testid="public-footer"
    >
      <div className="public-footer-container">
        <div className="public-footer-brand">
          <div className="public-footer-brand-title">
            <span
              className="public-brand-symbol"
              aria-hidden="true"
            >
              +
            </span>

            <strong>
              Clínica Médica
            </strong>
          </div>

          <p>
            Tecnologia e cuidado trabalhando
            juntos para uma experiência de
            saúde mais simples.
          </p>
        </div>

        <nav
          className="public-footer-navigation"
          aria-label="Navegação do rodapé"
        >
          <Link to="/">
            Início
          </Link>

          <Link to="/especialidades-clinicas">
            Especialidades
          </Link>

          <Link to="/corpo-clinico">
            Corpo clínico
          </Link>

          <Link to="/login">
            Área do profissional
          </Link>
        </nav>

        <div className="public-footer-bottom">
          <span>
            © {currentYear} Clínica Médica
          </span>

          <span>
            Galera do TI
          </span>
        </div>
      </div>
    </footer>
  )
}