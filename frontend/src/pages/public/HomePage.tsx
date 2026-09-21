import {
  Link,
} from 'react-router'

export function HomePage() {
  return (
    <section
      className="public-home"
      data-testid="public-home-page"
    >
      <div className="public-home-container">
        <div className="public-home-content">
          <span
            className="public-eyebrow"
            data-testid="public-home-eyebrow"
          >
            Saúde conectada ao seu cuidado
          </span>

          <h1
            data-testid="public-home-title"
          >
            Cuidado médico com uma experiência
            mais simples e humana.
          </h1>

          <p
            data-testid="public-home-description"
          >
            Conheça nossas especialidades,
            encontre profissionais e acompanhe
            a evolução de uma clínica preparada
            para unir saúde e tecnologia.
          </p>

          <div className="public-home-actions">
            <Link
              to="/corpo-clinico"
              className="primary-button"
              data-testid="public-home-doctors-button"
            >
              Conhecer corpo clínico
            </Link>

            <Link
              to="/especialidades-clinicas"
              className="secondary-button"
              data-testid="public-home-specialties-button"
            >
              Ver especialidades
            </Link>
          </div>
        </div>

        <div
          className="public-home-preview"
          aria-hidden="true"
        >
          <div className="public-home-preview-glow" />

          <div className="public-home-preview-card">
            <span className="public-home-preview-label">
              Clínica Médica
            </span>

            <strong>
              Saúde, cuidado e tecnologia.
            </strong>

            <p>
              Uma experiência digital criada
              para aproximar pacientes e
              profissionais.
            </p>

            <div className="public-home-preview-stats">
              <div>
                <strong>
                  +
                </strong>

                <span>
                  Especialidades
                </span>
              </div>

              <div>
                <strong>
                  24h
                </strong>

                <span>
                  Experiência digital
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}