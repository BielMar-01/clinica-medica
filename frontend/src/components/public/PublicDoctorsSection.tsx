import {
  useEffect,
  useState,
} from 'react'

import {
  Link,
} from 'react-router'

import {
  listPublicDoctorsRequest,
} from '../../services/public-doctor.service'

import type {
  PublicDoctor,
} from '../../types/public-doctor'

const HOME_DOCTORS_LIMIT =
  3

function getInitials(
  name: string,
) {
  const parts =
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean)

  if (parts.length === 0) {
    return 'DR'
  }

  if (parts.length === 1) {
    return parts[0]
      .slice(0, 2)
      .toUpperCase()
  }

  return (
    parts[0].charAt(0) +
    parts[
      parts.length - 1
    ].charAt(0)
  ).toUpperCase()
}

function getPrincipalSpecialty(
  doctor: PublicDoctor,
) {
  return (
    doctor.especialidades.find(
      (specialty) =>
        specialty.principal,
    ) ??
    doctor.especialidades[0] ??
    null
  )
}

export function PublicDoctorsSection() {
  const [
    doctors,
    setDoctors,
  ] =
    useState<
      PublicDoctor[]
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

    async function loadDoctors() {
      try {
        setLoading(true)
        setError(false)

        const response =
          await listPublicDoctorsRequest()

        if (!active) {
          return
        }

        setDoctors(
          response.data.slice(
            0,
            HOME_DOCTORS_LIMIT,
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

    void loadDoctors()

    return () => {
      active = false
    }
  }, [])

  return (
    <section
      className="public-doctors-section"
      aria-labelledby="public-doctors-title"
      data-testid="public-doctors-section"
    >
      <div className="public-doctors-container">
        <div className="public-section-header">
          <div className="public-section-heading">
            <span
              className="public-section-eyebrow"
              data-testid="public-doctors-eyebrow"
            >
              Corpo clínico
            </span>

            <h2
              id="public-doctors-title"
              data-testid="public-doctors-title"
            >
              Profissionais dedicados
              ao seu cuidado.
            </h2>

            <p
              data-testid="public-doctors-description"
            >
              Conheça os profissionais
              que fazem parte do nosso
              corpo clínico e suas
              especialidades.
            </p>
          </div>

          <Link
            to="/corpo-clinico"
            className="secondary-button public-section-desktop-action"
            data-testid="public-doctors-view-all-top"
          >
            Ver corpo clínico

            <span
              aria-hidden="true"
            >
              →
            </span>
          </Link>
        </div>

        {loading ? (
          <div
            className="public-doctors-grid"
            aria-label="Carregando corpo clínico"
            aria-busy="true"
            data-testid="public-doctors-loading"
          >
            {Array.from({
              length: 3,
            }).map(
              (_, index) => (
                <div
                  key={index}
                  className="public-doctor-card public-doctor-card-skeleton"
                  aria-hidden="true"
                >
                  <div className="public-doctor-skeleton-avatar" />

                  <div className="public-doctor-skeleton-title" />

                  <div className="public-doctor-skeleton-text" />

                  <div className="public-doctor-skeleton-text public-doctor-skeleton-text-short" />
                </div>
              ),
            )}
          </div>
        ) : null}

        {!loading &&
        error ? (
          <div
            className="public-doctors-feedback"
            role="status"
            data-testid="public-doctors-error"
          >
            <span
              className="public-doctors-feedback-icon"
              aria-hidden="true"
            >
              !
            </span>

            <div>
              <strong>
                Não foi possível carregar
                o corpo clínico.
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
        doctors.length ===
          0 ? (
          <div
            className="public-doctors-feedback"
            data-testid="public-doctors-empty"
          >
            <span
              className="public-doctors-feedback-icon"
              aria-hidden="true"
            >
              +
            </span>

            <div>
              <strong>
                Corpo clínico em atualização
              </strong>

              <p>
                Os profissionais disponíveis
                serão apresentados aqui.
              </p>
            </div>
          </div>
        ) : null}

        {!loading &&
        !error &&
        doctors.length >
          0 ? (
          <div
            className="public-doctors-grid"
            data-testid="public-doctors-grid"
          >
            {doctors.map(
              (doctor) => {
                const principalSpecialty =
                  getPrincipalSpecialty(
                    doctor,
                  )

                return (
                  <article
                    key={
                      doctor.id
                    }
                    className="public-doctor-card"
                    data-testid={`public-doctor-card-${doctor.id}`}
                  >
                    <div className="public-doctor-card-header">
                      <div
                        className="public-doctor-avatar"
                        aria-hidden="true"
                      >
                        {getInitials(
                          doctor.nomeCompleto,
                        )}
                      </div>

                      <span className="public-doctor-status">
                        <span />

                        Corpo clínico
                      </span>
                    </div>

                    <div className="public-doctor-card-content">
                      <span className="public-doctor-specialty">
                        {principalSpecialty?.nome ??
                          'Clínica Médica'}
                      </span>

                      <h3
                        data-testid={`public-doctor-name-${doctor.id}`}
                      >
                        {
                          doctor.nomeCompleto
                        }
                      </h3>

                      <p
                        data-testid={`public-doctor-crm-${doctor.id}`}
                      >
                        CRM {
                          doctor.crmNumero
                        } / {
                          doctor.crmUf
                        }
                      </p>
                    </div>

                    {doctor.especialidades.length >
                    1 ? (
                      <div className="public-doctor-specialties">
                        {doctor.especialidades
                          .filter(
                            (specialty) =>
                              specialty.id !==
                              principalSpecialty?.id,
                          )
                          .slice(
                            0,
                            2,
                          )
                          .map(
                            (specialty) => (
                              <span
                                key={
                                  specialty.id
                                }
                              >
                                {
                                  specialty.nome
                                }
                              </span>
                            ),
                          )}
                      </div>
                    ) : null}

                    <div className="public-doctor-card-footer">
                      <span>
                        Conhecer profissional
                      </span>

                      <span
                        aria-hidden="true"
                      >
                        →
                      </span>
                    </div>
                  </article>
                )
              },
            )}
          </div>
        ) : null}

        <div className="public-section-mobile-action">
          <Link
            to="/corpo-clinico"
            className="secondary-button"
            data-testid="public-doctors-view-all-bottom"
          >
            Ver todo o corpo clínico

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