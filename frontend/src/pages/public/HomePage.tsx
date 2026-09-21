import {
  Link,
} from 'react-router'

export function HomePage() {
  return (
    <section
      className="public-home"
      data-testid="public-home-page"
    >
      <div
        className="public-home-decoration public-home-decoration-one"
        aria-hidden="true"
      />

      <div
        className="public-home-decoration public-home-decoration-two"
        aria-hidden="true"
      />

      <div className="public-home-container">
        <div className="public-home-content">
          <span
            className="public-eyebrow"
            data-testid="public-home-eyebrow"
          >
            <span
              className="public-eyebrow-dot"
              aria-hidden="true"
            />

            Saúde conectada ao seu cuidado
          </span>

          <h1
            data-testid="public-home-title"
          >
            Cuidado médico
            <span>
              {' '}mais próximo,
            </span>
            <br />
            simples e humano.
          </h1>

          <p
            data-testid="public-home-description"
          >
            Encontre informações sobre
            especialidades e profissionais
            em uma experiência criada para
            aproximar pessoas, cuidado e
            tecnologia.
          </p>

          <div className="public-home-actions">
            <Link
              to="/corpo-clinico"
              className="primary-button public-home-primary-action"
              data-testid="public-home-doctors-button"
            >
              Conhecer corpo clínico

              <span
                aria-hidden="true"
              >
                →
              </span>
            </Link>

            <Link
              to="/especialidades-clinicas"
              className="secondary-button"
              data-testid="public-home-specialties-button"
            >
              Ver especialidades
            </Link>
          </div>

          <div
            className="public-home-benefits"
            aria-label="Diferenciais"
          >
            <div>
              <span
                className="public-benefit-check"
                aria-hidden="true"
              >
                ✓
              </span>

              <span>
                Informações centralizadas
              </span>
            </div>

            <div>
              <span
                className="public-benefit-check"
                aria-hidden="true"
              >
                ✓
              </span>

              <span>
                Experiência simples
              </span>
            </div>

            <div>
              <span
                className="public-benefit-check"
                aria-hidden="true"
              >
                ✓
              </span>

              <span>
                Cuidado conectado
              </span>
            </div>
          </div>
        </div>

        <div
          className="public-home-visual"
          aria-hidden="true"
        >
          <div className="public-home-visual-glow" />

          <div className="public-health-card">
            <div className="public-health-card-header">
              <div className="public-health-brand">
                <span className="public-health-brand-icon">
                  +
                </span>

                <div>
                  <small>
                    Clínica Médica
                  </small>

                  <strong>
                    Seu cuidado em um só lugar
                  </strong>
                </div>
              </div>

              <span className="public-health-status">
                <span />

                Conectado
              </span>
            </div>

            <div className="public-health-card-main">
              <span className="public-health-card-eyebrow">
                Experiência integrada
              </span>

              <strong>
                Informação clara para
                cuidar melhor.
              </strong>

              <p>
                Uma experiência pensada para
                facilitar a conexão entre
                pacientes, profissionais e
                cuidado.
              </p>
            </div>

            <div className="public-health-card-grid">
              <div className="public-health-mini-card">
                <span className="public-health-mini-icon">
                  +
                </span>

                <div>
                  <strong>
                    Especialidades
                  </strong>

                  <span>
                    Encontre a área de cuidado
                    que procura.
                  </span>
                </div>
              </div>

              <div className="public-health-mini-card">
                <span className="public-health-mini-icon">
                  ○
                </span>

                <div>
                  <strong>
                    Corpo clínico
                  </strong>

                  <span>
                    Conheça os profissionais
                    da clínica.
                  </span>
                </div>
              </div>
            </div>

            <div className="public-health-card-footer">
              <span>
                Clínica Médica
              </span>

              <span>
                Cuidado • Tecnologia • Pessoas
              </span>
            </div>
          </div>

          <div className="public-floating-card public-floating-card-top">
            <span className="public-floating-icon">
              ✓
            </span>

            <div>
              <strong>
                Cuidado conectado
              </strong>

              <span>
                Informação acessível
              </span>
            </div>
          </div>

          <div className="public-floating-card public-floating-card-bottom">
            <span className="public-floating-icon">
              +
            </span>

            <div>
              <strong>
                Saúde e tecnologia
              </strong>

              <span>
                Uma experiência mais simples
              </span>
            </div>
          </div>
        </div>
      </div>

      <div
        className="public-home-scroll-hint"
        aria-hidden="true"
      >
        <span />

        Explore
      </div>
    </section>
  )
}