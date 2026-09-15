import type {
  DoctorFilters as DoctorFiltersType,
} from '../../types/doctor'

import type {
  SpecialtySummary,
} from '../../types/specialty'

type DoctorFiltersProps = {
  filters: DoctorFiltersType

  specialties: SpecialtySummary[]

  specialtiesLoading: boolean

  onChange: (
    filters: DoctorFiltersType,
  ) => void

  onSearch: () => void

  onClear: () => void
}

export function DoctorFilters({
  filters,
  specialties,
  specialtiesLoading,
  onChange,
  onSearch,
  onClear,
}: DoctorFiltersProps) {
  return (
    <div
      className="patient-filters"
      data-testid="doctors-filters"
    >
      <div
        className="filter-group"
        data-testid="doctors-filters-fields"
      >
        <label>
          Nome

          <input
            type="text"
            value={filters.nome}
            onChange={(event) =>
              onChange({
                ...filters,
                nome: event.target.value,
                page: 1,
              })
            }
            placeholder="Buscar por nome"
            data-testid="doctors-name-filter"
          />
        </label>

        <label>
          CRM

          <input
            type="text"
            value={filters.crm}
            onChange={(event) =>
              onChange({
                ...filters,
                crm: event.target.value,
                page: 1,
              })
            }
            placeholder="Buscar por CRM"
            data-testid="doctors-crm-filter"
          />
        </label>

        <label>
          UF do CRM

          <input
            type="text"
            value={filters.crmUf}
            maxLength={2}
            onChange={(event) =>
              onChange({
                ...filters,
                crmUf:
                  event.target.value
                    .toUpperCase(),
                page: 1,
              })
            }
            placeholder="SP"
            data-testid="doctors-crm-uf-filter"
          />
        </label>

        <label>
          Especialidade

          <select
            value={
              filters.especialidadeId
            }
            disabled={
              specialtiesLoading
            }
            onChange={(event) =>
              onChange({
                ...filters,
                especialidadeId:
                  event.target.value,
                page: 1,
              })
            }
            data-testid="doctors-specialty-filter"
          >
            <option value="">
              {specialtiesLoading
                ? 'Carregando...'
                : 'Todas'}
            </option>

            {specialties.map(
              (specialty) => (
                <option
                  key={specialty.id}
                  value={specialty.id}
                >
                  {specialty.nome}
                </option>
              ),
            )}
          </select>
        </label>

        <label>
          Status

          <select
            value={filters.ativo}
            onChange={(event) => {
              const ativo =
                event.target
                  .value as
                  DoctorFiltersType['ativo']

              onChange({
                ...filters,
                ativo,
                page: 1,
              })
            }}
            data-testid="doctors-status-filter"
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
        className="filter-actions"
        data-testid="doctors-filter-actions"
      >
        <button
          type="button"
          onClick={onSearch}
          data-testid="doctors-search-button"
        >
          Buscar
        </button>

        <button
          type="button"
          className="secondary-button"
          onClick={onClear}
          data-testid="doctors-clear-filters-button"
        >
          Limpar
        </button>
      </div>
    </div>
  )
}