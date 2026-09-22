import {
  useEffect,
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

import '../../styles/components/public-specialties.css'

const HOME_SPECIALTIES_LIMIT =
  6

function getSpecialtyInitial(
  name: string,
) {
  return (
    name
      .trim()
      .charAt(0)
      .toUpperCase() || '+'
  )
}

export function PublicSpecialtiesSection() {
  const [
    specialties,
    setSpecialties,
  ] =
    useState<
      SpecialtySummary[]
    >([])

  const [
    loading,
    setLoading,
  ] =
    useState(true)

  const [
    error,
    setError,
  ] =
    useState(false)

  useEffect(() => {
    let active = true

    async function loadSpecialties() {
      try {
        setLoading(true)
        setError(false)

        const response =
          await listPublicSpecialtiesRequest()

        if (!active) {
          return
        }

        setSpecialties(
          response.data
            .filter(
              (specialty) =>
                specialty.ativo,
            )
            .slice(
              0,
              HOME_SPECIALTIES_LIMIT,
            ),
        )
      } catch {
        if (!active) {
          return
        }

        setError(true)
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    void loadSpecialties()

    return () => {
      active = false
    }
  }, [])

  return (
    <section
      className="public-specialties-section"
      aria-labelledby="public-specialties-title"
      data-testid="public-specialties-section"
    >
      <div className="public-specialties-container">
        <div className="public-section-header">
          <div className="public-section-heading">
            <span
              className="public-section-eyebrow"
              data-testid="public-specialties-eyebrow"
            >
              Especialidades
            </span>

            <h2
              id="public-specialties-title"
              data-testid="public-specialties-title"
            >
              Cuidado especializado
              para diferentes momentos.
            </h2>

            <p
              data-testid="public-specialties-description"
            >
              Conheça as áreas de atendimento
              disponíveis e encontre a
              especialidade adequada para o
              cuidado que você procura.
            </p>
          </div>

          <Link
            to="/especialidades-clinicas"
            className="secondary-button public-section-desktop-action"
            data-testid="public-specialties-view-all-top"
          >
            Ver todas

            <span
              aria-hidden="true"
            >
              →
            </span>
          </Link>
        </div>

        {loading ? (
          <div
            className="public-specialties-grid"
            aria-label="Carregando especialidades"
            aria-busy="true"
            data-testid="public-specialties-loading"
          >
            {Array.from({
              length: 6,
            }).map(
              (_, index) => (
                <div
                  key={index}
                  className="public-specialty-card public-specialty-card-skeleton"
                  aria-hidden="true"
                >
                  <div className="public-specialty-skeleton-icon" />

                  <div className="public-specialty-skeleton-title" />

                  <div className="public-specialty-skeleton-text" />

                  <div className="public-specialty-skeleton-text public-specialty-skeleton-text-short" />
                </div>
              ),
            )}
          </div>
        ) : null}

        {!loading &&
        error ? (
          <div
            className="public-specialties-feedback"
            role="status"
            data-testid="public-specialties-error"
          >
            <span
              className="public-specialties-feedback-icon"
              aria-hidden="true"
            >
              !
            </span>

            <div>
              <strong>
                Não foi possível carregar
                as especialidades.
              </strong>

              <p>
                Tente novamente em alguns
                instantes.
              </p>
            </div>
          </div>
        ) : null}

        {!loading &&
        !error &&
        specialties.length ===
          0 ? (
          <div
            className="public-specialties-feedback"
            data-testid="public-specialties-empty"
          >
            <span
              className="public-specialties-feedback-icon"
              aria-hidden="true"
            >
              +
            </span>

            <div>
              <strong>
                Especialidades em atualização
              </strong>

              <p>
                As especialidades disponíveis
                serão apresentadas aqui.
              </p>
            </div>
          </div>
        ) : null}

        {!loading &&
        !error &&
        specialties.length >
          0 ? (
          <div
            className="public-specialties-grid"
            data-testid="public-specialties-grid"
          >
            {specialties.map(
              (
                specialty,
                index,
              ) => (
                <article
                  key={
                    specialty.id
                  }
                  className="public-specialty-card"
                  data-testid={`public-specialty-card-${specialty.id}`}
                >
                  <div className="public-specialty-card-top">
                    <span
                      className="public-specialty-icon"
                      aria-hidden="true"
                    >
                      {getSpecialtyInitial(
                        specialty.nome,
                      )}
                    </span>

                    <span className="public-specialty-number">
                      {String(
                        index + 1,
                      ).padStart(
                        2,
                        '0',
                      )}
                    </span>
                  </div>

                  <div className="public-specialty-card-content">
                    <h3
                      data-testid={`public-specialty-name-${specialty.id}`}
                    >
                      {
                        specialty.nome
                      }
                    </h3>

                    <p>
                      {specialty.descricao?.trim() ||
                        'Conheça esta especialidade e os profissionais disponíveis para atendimento.'}
                    </p>
                  </div>

                  <div className="public-specialty-card-footer">
                    <span>
                      Saiba mais
                    </span>

                    <span
                      className="public-specialty-arrow"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </div>
                </article>
              ),
            )}
          </div>
        ) : null}

        <div className="public-section-mobile-action">
          <Link
            to="/especialidades-clinicas"
            className="secondary-button"
            data-testid="public-specialties-view-all-bottom"
          >
            Ver todas as especialidades

            <span
              aria-hidden="true"
            >
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  )
}