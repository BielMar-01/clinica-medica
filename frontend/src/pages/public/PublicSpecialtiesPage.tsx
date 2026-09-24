import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  Link,
} from 'react-router'

import {
  listPublicSpecialtiesRequest,
} from '../../services/public-specialty.service'

import type {
  SpecialtySummary,
} from '../../types/specialty'

function normalizeText(
  value: string,
) {
  return value
    .normalize('NFD')
    .replace(
      /[\u0300-\u036f]/g,
      '',
    )
    .toLowerCase()
    .trim()
}

export function PublicSpecialtiesPage() {
  const [
    specialties,
    setSpecialties,
  ] = useState<SpecialtySummary[]>([])

  const [
    search,
    setSearch,
  ] = useState('')

  const [
    isLoading,
    setIsLoading,
  ] = useState(true)

  const [
    error,
    setError,
  ] = useState<string | null>(
    null,
  )

  useEffect(() => {
    let isMounted = true

    async function fetchSpecialties() {
      try {
        const response =
          await listPublicSpecialtiesRequest()

        if (!isMounted) {
          return
        }

        setSpecialties(
          response.data.filter(
            (specialty) =>
              specialty.ativo,
          ),
        )

        setError(null)
      } catch {
        if (!isMounted) {
          return
        }

        setError(
          'Não foi possível carregar as especialidades. Tente novamente.',
        )
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void fetchSpecialties()

    return () => {
      isMounted = false
    }
  }, [])

  async function handleRetry() {
    try {
      setIsLoading(true)
      setError(null)

      const response =
        await listPublicSpecialtiesRequest()

      setSpecialties(
        response.data.filter(
          (specialty) =>
            specialty.ativo,
        ),
      )
    } catch {
      setError(
        'Não foi possível carregar as especialidades. Tente novamente.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  const filteredSpecialties =
    useMemo(() => {
      const normalizedSearch =
        normalizeText(search)

      if (!normalizedSearch) {
        return specialties
      }

      return specialties.filter(
        (specialty) => {
          const normalizedName =
            normalizeText(
              specialty.nome,
            )

          const normalizedDescription =
            normalizeText(
              specialty.descricao ??
                '',
            )

          return (
            normalizedName.includes(
              normalizedSearch,
            ) ||
            normalizedDescription.includes(
              normalizedSearch,
            )
          )
        },
      )
    }, [
      search,
      specialties,
    ])

  const resultLabel =
    filteredSpecialties.length === 1
      ? '1 especialidade'
      : `${filteredSpecialties.length} especialidades`

  return (
    <div
      className="public-specialties-page"
      data-testid="public-specialties-page"
    >
      <section
        className="public-specialties-hero"
        aria-labelledby="public-specialties-page-title"
      >
        <div
          className="public-specialties-hero-decoration"
          aria-hidden="true"
        />

        <div className="public-specialties-page-container">
          <div className="public-specialties-hero-content">
            <span
              className="public-section-eyebrow"
              data-testid="public-specialties-page-eyebrow"
            >
              Especialidades
            </span>

            <h1
              id="public-specialties-page-title"
              data-testid="public-specialties-page-title"
            >
              Encontre a área de cuidado
              <span>
                {' '}que você procura.
              </span>
            </h1>

            <p
              data-testid="public-specialties-page-description"
            >
              Conheça as especialidades
              disponíveis e encontre
              informações para tornar sua
              jornada de cuidado mais
              simples.
            </p>
          </div>

          <div
            className="public-specialties-hero-card"
            aria-hidden="true"
          >
            <div className="public-specialties-hero-icon">
              +
            </div>

            <span>
              Clínica Médica
            </span>

            <strong>
              Diferentes áreas de cuidado.
              Uma experiência integrada.
            </strong>
          </div>
        </div>
      </section>

      <section
        className="public-specialties-catalog"
        aria-labelledby="public-specialties-catalog-title"
      >
        <div className="public-specialties-page-container">
          <div className="public-specialties-catalog-header">
            <div>
              <span className="public-specialties-catalog-eyebrow">
                Explore
              </span>

              <h2
                id="public-specialties-catalog-title"
                data-testid="public-specialties-catalog-title"
              >
                Nossas especialidades
              </h2>
            </div>

            {!isLoading &&
              !error && (
                <span
                  className="public-specialties-result-count"
                  data-testid="public-specialties-result-count"
                >
                  {resultLabel}
                </span>
              )}
          </div>

          <div className="public-specialties-search-wrapper">
            <label
              className="public-specialties-search"
              htmlFor="public-specialties-search-input"
            >
              <span
                className="public-specialties-search-icon"
                aria-hidden="true"
              >
                ⌕
              </span>

              <input
                id="public-specialties-search-input"
                type="search"
                value={search}
                onChange={(
                  event,
                ) => {
                  setSearch(
                    event.target.value,
                  )
                }}
                placeholder="Buscar por especialidade..."
                autoComplete="off"
                data-testid="public-specialties-search-input"
              />

              {search && (
                <button
                  type="button"
                  className="public-specialties-search-clear"
                  onClick={() => {
                    setSearch('')
                  }}
                  aria-label="Limpar busca"
                  data-testid="public-specialties-search-clear"
                >
                  ×
                </button>
              )}
            </label>
          </div>

          {isLoading && (
            <div
              className="public-specialties-page-grid"
              aria-label="Carregando especialidades"
              data-testid="public-specialties-page-loading"
            >
              {Array.from({
                length: 6,
              }).map((_, index) => (
                <div
                  key={index}
                  className="public-specialty-page-card public-specialty-page-card-skeleton"
                >
                  <div className="public-specialty-page-skeleton-icon" />

                  <div className="public-specialty-page-skeleton-title" />

                  <div className="public-specialty-page-skeleton-line" />

                  <div className="public-specialty-page-skeleton-line public-specialty-page-skeleton-line-short" />
                </div>
              ))}
            </div>
          )}

          {!isLoading &&
            error && (
              <div
                className="public-specialties-page-state"
                data-testid="public-specialties-page-error"
              >
                <div
                  className="public-specialties-state-icon"
                  aria-hidden="true"
                >
                  !
                </div>

                <h3>
                  Não conseguimos carregar
                  as especialidades.
                </h3>

                <p>
                  {error}
                </p>

                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => {
                    void handleRetry()
                  }}
                  data-testid="public-specialties-retry-button"
                >
                  Tentar novamente
                </button>
              </div>
            )}

          {!isLoading &&
            !error &&
            specialties.length ===
              0 && (
                <div
                  className="public-specialties-page-state"
                  data-testid="public-specialties-page-empty"
                >
                  <div
                    className="public-specialties-state-icon"
                    aria-hidden="true"
                  >
                    +
                  </div>

                  <h3>
                    Nenhuma especialidade
                    disponível.
                  </h3>

                  <p>
                    Ainda não existem
                    especialidades públicas
                    disponíveis para
                    consulta.
                  </p>
                </div>
              )}

          {!isLoading &&
            !error &&
            specialties.length >
              0 &&
            filteredSpecialties.length ===
              0 && (
                <div
                  className="public-specialties-page-state"
                  data-testid="public-specialties-search-empty"
                >
                  <div
                    className="public-specialties-state-icon"
                    aria-hidden="true"
                  >
                    ⌕
                  </div>

                  <h3>
                    Nenhuma especialidade
                    encontrada.
                  </h3>

                  <p>
                    Não encontramos
                    resultados para
                    <strong>
                      {' '}
                      “{search}”
                    </strong>
                    .
                  </p>

                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => {
                      setSearch('')
                    }}
                    data-testid="public-specialties-empty-clear-button"
                  >
                    Limpar busca
                  </button>
                </div>
              )}

          {!isLoading &&
            !error &&
            filteredSpecialties.length >
              0 && (
                <div
                  className="public-specialties-page-grid"
                  data-testid="public-specialties-page-grid"
                >
                  {filteredSpecialties.map(
                    (
                      specialty,
                      index,
                    ) => (
                      <article
                        key={
                          specialty.id
                        }
                        className="public-specialty-page-card"
                        data-testid={`public-specialty-page-card-${specialty.id}`}
                      >
                        <div className="public-specialty-page-card-top">
                          <span className="public-specialty-page-card-icon">
                            {
                              specialty.nome
                                .charAt(0)
                                .toUpperCase()
                            }
                          </span>

                          <span className="public-specialty-page-card-number">
                            {String(
                              index +
                                1,
                            ).padStart(
                              2,
                              '0',
                            )}
                          </span>
                        </div>

                        <div className="public-specialty-page-card-content">
                          <h3
                            data-testid={`public-specialty-page-name-${specialty.id}`}
                          >
                            {
                              specialty.nome
                            }
                          </h3>

                          <p>
                            {specialty.descricao ||
                              'Conheça esta área de cuidado disponível na Clínica Médica.'}
                          </p>
                        </div>

                        <div
                          className="public-specialty-page-card-footer"
                          aria-hidden="true"
                        >
                          <span>
                            Clínica Médica
                          </span>

                          <span>
                            +
                          </span>
                        </div>
                      </article>
                    ),
                  )}
                </div>
              )}
        </div>
      </section>

      <section
        className="public-specialties-page-cta"
        aria-labelledby="public-specialties-page-cta-title"
        data-testid="public-specialties-page-cta"
      >
        <div className="public-specialties-page-container">
          <div className="public-specialties-page-cta-card">
            <div>
              <span>
                Corpo clínico
              </span>

              <h2
                id="public-specialties-page-cta-title"
              >
                Quer conhecer nossos
                profissionais?
              </h2>

              <p>
                Explore o corpo clínico e
                conheça os profissionais
                disponíveis na Clínica
                Médica.
              </p>
            </div>

            <Link
              to="/corpo-clinico"
              className="primary-button"
              data-testid="public-specialties-doctors-button"
            >
              Conhecer corpo clínico

              <span
                aria-hidden="true"
              >
                →
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}