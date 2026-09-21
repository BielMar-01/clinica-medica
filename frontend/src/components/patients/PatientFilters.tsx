import {
  useState,
  type FormEvent,
} from 'react'

import type {
  PatientFilters,
} from '../../types/patient'

import './PatientFilters.css'

type PatientFiltersProps = {
  filters:
    PatientFilters

  onChange: (
    filters:
      PatientFilters,
  ) => void

  onApply: (
    filters:
      PatientFilters,
  ) => void

  onClear:
    () => void
}

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle
        cx="11"
        cy="11"
        r="7"
      />

      <path d="m20 20-3.5-3.5" />
    </svg>
  )
}

function FilterIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 6h16" />
      <path d="M7 12h10" />
      <path d="M10 18h4" />
    </svg>
  )
}

function ChevronIcon({
  expanded,
}: {
  expanded: boolean
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={
        expanded
          ? 'filter-chevron filter-chevron-expanded'
          : 'filter-chevron'
      }
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

export function PatientFiltersComponent({
  filters,
  onChange,
  onApply,
  onClear,
}: PatientFiltersProps) {
  const [
    expanded,
    setExpanded,
  ] =
    useState(false)

  function handleSubmit(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    onApply({
      ...filters,
      page: 1,
    })
  }

  function handleSortChange(
    value: string,
  ) {
    let nextFilters:
      PatientFilters

    switch (value) {
      case 'nome-desc':
        nextFilters = {
          ...filters,
          ordenarPor:
            'nome',
          ordem:
            'desc',
          page: 1,
        }
        break

      case 'recentes':
        nextFilters = {
          ...filters,
          ordenarPor:
            'criadoEm',
          ordem:
            'desc',
          page: 1,
        }
        break

      case 'antigos':
        nextFilters = {
          ...filters,
          ordenarPor:
            'criadoEm',
          ordem:
            'asc',
          page: 1,
        }
        break

      case 'nome-asc':
      default:
        nextFilters = {
          ...filters,
          ordenarPor:
            'nome',
          ordem:
            'asc',
          page: 1,
        }
        break
    }

    onChange(
      nextFilters,
    )

    onApply(
      nextFilters,
    )
  }

  function getSortValue() {
    if (
      filters.ordenarPor ===
        'criadoEm' &&
      filters.ordem ===
        'desc'
    ) {
      return 'recentes'
    }

    if (
      filters.ordenarPor ===
        'criadoEm' &&
      filters.ordem ===
        'asc'
    ) {
      return 'antigos'
    }

    if (
      filters.ordenarPor ===
        'nome' &&
      filters.ordem ===
        'desc'
    ) {
      return 'nome-desc'
    }

    return 'nome-asc'
  }

  const activeAdvancedFilters =
    [
      filters.cpf,
      filters.telefone,
      filters.ativo,
    ].filter(Boolean).length

  const hasAdvancedFilters =
    activeAdvancedFilters > 0

  function handleClear() {
    onClear()

    setExpanded(false)
  }

  return (
    <form
      className="patient-filters"
      data-testid="patients-filters"
      onSubmit={
        handleSubmit
      }
    >
      <div className="patient-filter-heading">
        <div>
          <strong>
            Localizar pacientes
          </strong>

          <span>
            Pesquise por nome ou utilize
            filtros adicionais.
          </span>
        </div>
      </div>

      <div
        className="patient-filter-toolbar"
        data-testid="patients-filter-toolbar"
      >
        <div className="patient-main-search">
          <label
            htmlFor="patient-name-search"
            className="sr-only"
          >
            Buscar paciente
          </label>

          <span
            className="patient-search-icon"
            aria-hidden="true"
          >
            <SearchIcon />
          </span>

          <input
            id="patient-name-search"
            data-testid="patients-name-filter-input"
            type="search"
            value={
              filters.nome
            }
            onChange={(
              event,
            ) =>
              onChange({
                ...filters,

                nome:
                  event.target
                    .value,

                page: 1,
              })
            }
            placeholder="Buscar paciente por nome..."
          />
        </div>

        <div className="patient-filter-toolbar-actions">
          <button
            data-testid="patients-filters-button"
            type="button"
            className={
              hasAdvancedFilters
                ? 'filter-toggle-button filter-toggle-button-active'
                : 'filter-toggle-button'
            }
            aria-expanded={
              expanded
            }
            aria-controls="patients-advanced-filters"
            onClick={() =>
              setExpanded(
                (
                  current,
                ) =>
                  !current,
              )
            }
          >
            <FilterIcon />

            <span>
              Filtros
            </span>

            {hasAdvancedFilters && (
              <span
                className="active-filter-count"
                aria-label={`${activeAdvancedFilters} filtros ativos`}
              >
                {
                  activeAdvancedFilters
                }
              </span>
            )}

            <ChevronIcon
              expanded={
                expanded
              }
            />
          </button>

          <label className="patient-sort-field">
            <span className="sr-only">
              Ordenar pacientes
            </span>

            <select
              data-testid="patients-sort-select"
              value={
                getSortValue()
              }
              onChange={(
                event,
              ) =>
                handleSortChange(
                  event.target
                    .value,
                )
              }
              aria-label="Ordenar pacientes"
            >
              <option value="nome-asc">
                Nome A → Z
              </option>

              <option value="nome-desc">
                Nome Z → A
              </option>

              <option value="recentes">
                Mais recentes
              </option>

              <option value="antigos">
                Mais antigos
              </option>
            </select>
          </label>

          <button
            data-testid="patients-search-button"
            type="submit"
            className="patient-search-button"
          >
            <SearchIcon />

            Buscar
          </button>
        </div>
      </div>

      {expanded && (
        <div
          id="patients-advanced-filters"
          className="patient-advanced-filters"
          data-testid="patients-filters-panel"
        >
          <div className="patient-advanced-filter-header">
            <div>
              <strong>
                Filtros avançados
              </strong>

              <span>
                Refine os resultados por
                informações cadastrais.
              </span>
            </div>

            {hasAdvancedFilters && (
              <span className="active-filters-label">
                {
                  activeAdvancedFilters
                }{' '}
                {activeAdvancedFilters === 1
                  ? 'filtro ativo'
                  : 'filtros ativos'}
              </span>
            )}
          </div>

          <div
            className="patient-advanced-filter-grid"
            data-testid="patients-filters-fields"
          >
            <label>
              CPF

              <input
                data-testid="patients-cpf-filter-input"
                type="text"
                value={
                  filters.cpf
                }
                onChange={(
                  event,
                ) =>
                  onChange({
                    ...filters,

                    cpf:
                      event.target
                        .value,

                    page: 1,
                  })
                }
                placeholder="Buscar por CPF"
              />
            </label>

            <label>
              Telefone

              <input
                data-testid="patients-phone-filter-input"
                type="text"
                value={
                  filters.telefone
                }
                onChange={(
                  event,
                ) =>
                  onChange({
                    ...filters,

                    telefone:
                      event.target
                        .value,

                    page: 1,
                  })
                }
                placeholder="Buscar por telefone"
              />
            </label>

            <label>
              Status

              <select
                data-testid="patients-status-filter-select"
                value={
                  filters.ativo
                }
                onChange={(
                  event,
                ) => {
                  const ativo =
                    event
                      .target
                      .value as PatientFilters['ativo']

                  onChange({
                    ...filters,
                    ativo,
                    page: 1,
                  })
                }}
              >
                <option value="">
                  Todos
                </option>

                <option value="true">
                  Ativos
                </option>

                <option value="false">
                  Inativos
                </option>
              </select>
            </label>
          </div>

          <div
            className="patient-advanced-filter-actions"
            data-testid="patients-filter-actions"
          >
            <button
              data-testid="patients-clear-filters-button"
              type="button"
              className="secondary-button"
              onClick={
                handleClear
              }
            >
              Limpar filtros
            </button>

            <button
              data-testid="patients-apply-filters-button"
              type="submit"
              className="primary-button"
            >
              Aplicar filtros
            </button>
          </div>
        </div>
      )}
    </form>
  )
}