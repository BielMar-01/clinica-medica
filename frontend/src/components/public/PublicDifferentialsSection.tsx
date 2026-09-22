const differentials = [
  {
    number: '01',
    title: 'Cuidado centrado',
    description:
      'Uma experiência pensada para tornar o acesso às informações de saúde mais simples, claro e próximo.',
  },
  {
    number: '02',
    title: 'Informações organizadas',
    description:
      'Especialidades e profissionais apresentados de forma objetiva para facilitar sua jornada de cuidado.',
  },
  {
    number: '03',
    title: 'Profissionais e especialidades',
    description:
      'Conheça o corpo clínico e encontre informações sobre as diferentes áreas de atendimento.',
  },
  {
    number: '04',
    title: 'Tecnologia integrada',
    description:
      'Tecnologia aplicada para conectar informações, profissionais e pacientes em uma experiência mais fluida.',
  },
]

export function PublicDifferentialsSection() {
  return (
    <section
      className="public-differentials-section"
      aria-labelledby="public-differentials-title"
      data-testid="public-differentials-section"
    >
      <div className="public-differentials-container">
        <div className="public-differentials-intro">
          <span
            className="public-section-eyebrow"
            data-testid="public-differentials-eyebrow"
          >
            Nossa experiência
          </span>

          <h2
            id="public-differentials-title"
            data-testid="public-differentials-title"
          >
            Saúde, informação e
            tecnologia trabalhando
            juntas.
          </h2>

          <p
            data-testid="public-differentials-description"
          >
            Criamos uma experiência
            digital que aproxima
            pacientes, profissionais e
            informações importantes para
            tornar a jornada de cuidado
            mais simples.
          </p>

          <div
            className="public-differentials-highlight"
            data-testid="public-differentials-highlight"
          >
            <div
              className="public-differentials-highlight-icon"
              aria-hidden="true"
            >
              +
            </div>

            <div>
              <span>
                Uma experiência integrada
              </span>

              <strong>
                Informação para cuidar
                melhor.
              </strong>
            </div>
          </div>
        </div>

        <div
          className="public-differentials-list"
          data-testid="public-differentials-list"
        >
          {differentials.map(
            (
              differential,
              index,
            ) => (
              <article
                key={
                  differential.number
                }
                className="public-differential-item"
                data-testid={`public-differential-${index + 1}`}
              >
                <div className="public-differential-number">
                  {
                    differential.number
                  }
                </div>

                <div className="public-differential-content">
                  <h3>
                    {
                      differential.title
                    }
                  </h3>

                  <p>
                    {
                      differential.description
                    }
                  </p>
                </div>

                <span
                  className="public-differential-indicator"
                  aria-hidden="true"
                >
                  →
                </span>
              </article>
            ),
          )}
        </div>
      </div>
    </section>
  )
}