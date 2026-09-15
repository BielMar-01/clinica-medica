export function DoctorsPage() {
  return (
    <section
      className="page"
      data-testid="doctors-page"
    >
      <header
        className="page-header"
        data-testid="doctors-page-header"
      >
        <div>
          <h1
            data-testid="doctors-page-title"
          >
            Médicos
          </h1>

          <p
            data-testid="doctors-page-description"
          >
            Cadastro e gerenciamento dos médicos da clínica.
          </p>
        </div>
      </header>

      <div
        className="content-card"
        data-testid="doctors-module-placeholder"
      >
        Módulo de médicos em construção.
      </div>
    </section>
  )
}