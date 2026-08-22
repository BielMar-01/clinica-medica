import type {
  SpecialtyFilters,
} from '../../types/specialty'

type SpecialtyFiltersProps = {
  filters: SpecialtyFilters

  onChange: (
    filters: SpecialtyFilters,
  ) => void

  onSearch: () => void

  onClear: () => void
}

export function SpecialtyFiltersComponent({
  filters,
  onChange,
  onSearch,
  onClear,
}: SpecialtyFiltersProps) {
  return (
    <div
      className="patient-filters"
      data-testid="specialties-filters"
    >
      <div
        className="filter-group"
        data-testid="specialties-filters-fields"
      >
        <label>
          Nome

          <input
            data-testid="specialties-name-filter-input"
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
          Status

          <select
            data-testid="specialties-status-filter-select"
            value={filters.ativo}
            onChange={(event) => {
              const ativo =
                event.target
                  .value as SpecialtyFilters['ativo']

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
              Ativas
            </option>

            <option value="false">
              Inativas
            </option>
          </select>
        </label>
      </div>

      <div
        className="filter-actions"
        data-testid="specialties-filter-actions"
      >
        <button
          data-testid="specialties-search-button"
          type="button"
          onClick={onSearch}
        >
          Buscar
        </button>

        <button
          data-testid="specialties-clear-filters-button"
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