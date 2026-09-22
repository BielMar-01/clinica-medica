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
        <div className="public-footer-main">
          <div className="public-footer-brand">
            <Link
              to="/"
              className="public-footer-brand-link"
              aria-label="Clínica Médica - Início"
              data-testid="public-footer-brand-link"
            >
              <span
                className="public-brand-symbol"
                aria-hidden="true"
              >
                +
              </span>

              <div className="public-footer-brand-content">
                <strong>
                  Clínica Médica
                </strong>

                <span>
                  Saúde conectada ao seu cuidado
                </span>
              </div>
            </Link>

            <p>
              Uma experiência criada para
              aproximar pessoas, profissionais,
              informação e tecnologia durante
              a jornada de cuidado.
            </p>

            <div
              className="public-footer-pillars"
              aria-label="Pilares da Clínica Médica"
            >
              <span>
                Cuidado
              </span>

              <span
                aria-hidden="true"
                className="public-footer-pillar-dot"
              />

              <span>
                Tecnologia
              </span>

              <span
                aria-hidden="true"
                className="public-footer-pillar-dot"
              />

              <span>
                Pessoas
              </span>
            </div>
          </div>

          <div className="public-footer-links">
            <div className="public-footer-column">
              <span className="public-footer-column-title">
                Explore
              </span>

              <nav
                aria-label="Navegação institucional do rodapé"
                data-testid="public-footer-navigation"
              >
                <Link
                  to="/"
                  data-testid="public-footer-home-link"
                >
                  Início
                </Link>

                <Link
                  to="/especialidades-clinicas"
                  data-testid="public-footer-specialties-link"
                >
                  Especialidades
                </Link>

                <Link
                  to="/corpo-clinico"
                  data-testid="public-footer-doctors-link"
                >
                  Corpo clínico
                </Link>
              </nav>
            </div>

            <div className="public-footer-column">
              <span className="public-footer-column-title">
                Profissionais
              </span>

              <div className="public-footer-professional">
                <p>
                  Acesse o ambiente interno
                  para gerenciamento da clínica.
                </p>

                <Link
                  to="/login"
                  className="public-footer-login-link"
                  data-testid="public-footer-login-link"
                >
                  Área do profissional

                  <span
                    aria-hidden="true"
                  >
                    →
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="public-footer-bottom">
          <span
            data-testid="public-footer-copyright"
          >
            © {currentYear} Clínica Médica.
            Todos os direitos reservados.
          </span>

          <div
            className="public-footer-signature"
            data-testid="public-footer-signature"
          >
            <span>
              Saúde
            </span>

            <span
              className="public-footer-signature-dot"
              aria-hidden="true"
            />

            <span>
              Informação
            </span>

            <span
              className="public-footer-signature-dot"
              aria-hidden="true"
            />

            <span>
              Tecnologia
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}