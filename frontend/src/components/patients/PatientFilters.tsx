import type {
  PatientFilters,
} from '../../types/patient'

type PatientFiltersProps = {
  filters: PatientFilters

  onChange: (
    filters: PatientFilters,
  ) => void

  onSearch: () => void

  onClear: () => void
}

export function PatientFiltersComponent({
  filters,
  onChange,
  onSearch,
  onClear,
}: PatientFiltersProps) {
  return (
    <div
      className="patient-filters"
      data-testid="patients-filters"
    >
      <div
        className="filter-group"
        data-testid="patients-filters-fields"
      >
        <label>
          Nome

          <input
            data-testid="patients-name-filter-input"
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
          />
        </label>

        <label>
          CPF

          <input
            data-testid="patients-cpf-filter-input"
            type="text"
            value={filters.cpf}
            onChange={(event) =>
              onChange({
                ...filters,
                cpf: event.target.value,
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
            value={filters.telefone}
            onChange={(event) =>
              onChange({
                ...filters,
                telefone: event.target.value,
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
            value={filters.ativo}
            onChange={(event) => {
              const ativo =
                event.target
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
        className="filter-actions"
        data-testid="patients-filter-actions"
      >
        <button
          data-testid="patients-search-button"
          type="button"
          onClick={onSearch}
        >
          Buscar
        </button>

        <button
          data-testid="patients-clear-filters-button"
          type="button"
          className="secondary-button"
          onClick={onClear}
        >
          Limpar
        </button>
      </div>
    </div>
  )
}