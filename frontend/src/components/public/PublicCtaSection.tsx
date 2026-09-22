import {
  Link,
} from 'react-router'

export function PublicCtaSection() {
  return (
    <section
      className="public-cta-section"
      aria-labelledby="public-cta-title"
      data-testid="public-cta-section"
    >
      <div className="public-cta-container">
        <div
          className="public-cta-decoration public-cta-decoration-one"
          aria-hidden="true"
        />

        <div
          className="public-cta-decoration public-cta-decoration-two"
          aria-hidden="true"
        />

        <div className="public-cta-content">
          <span
            className="public-cta-eyebrow"
            data-testid="public-cta-eyebrow"
          >
            <span
              className="public-cta-eyebrow-dot"
              aria-hidden="true"
            />

            Cuidado mais próximo
          </span>

          <h2
            id="public-cta-title"
            data-testid="public-cta-title"
          >
            Encontre o cuidado
            <span>
              {' '}que faz sentido
              para você.
            </span>
          </h2>

          <p
            data-testid="public-cta-description"
          >
            Conheça nossas especialidades
            e os profissionais que fazem
            parte do corpo clínico.
          </p>

          <div className="public-cta-actions">
            <Link
              to="/especialidades-clinicas"
              className="public-cta-primary-button"
              data-testid="public-cta-specialties-button"
            >
              Explorar especialidades

              <span
                aria-hidden="true"
              >
                →
              </span>
            </Link>

            <Link
              to="/corpo-clinico"
              className="public-cta-secondary-button"
              data-testid="public-cta-doctors-button"
            >
              Conhecer profissionais
            </Link>
          </div>
        </div>

        <div
          className="public-cta-visual"
          aria-hidden="true"
        >
          <div className="public-cta-brand-card">
            <div className="public-cta-brand-icon">
              +
            </div>

            <div className="public-cta-brand-content">
              <span>
                Clínica Médica
              </span>

              <strong>
                Saúde conectada
                ao seu cuidado.
              </strong>

              <p>
                Pessoas, informação
                e tecnologia em uma
                experiência integrada.
              </p>
            </div>

            <div className="public-cta-brand-footer">
              <span>
                Cuidado
              </span>

              <span
                aria-hidden="true"
              >
                •
              </span>

              <span>
                Tecnologia
              </span>

              <span
                aria-hidden="true"
              >
                •
              </span>

              <span>
                Pessoas
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}