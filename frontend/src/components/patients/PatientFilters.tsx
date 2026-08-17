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
    <div className="patient-filters">
      <div className="filter-group">
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
          />
        </label>

        <label>
          CPF

          <input
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
            value={filters.ativo}
            onChange={(event) => {
              const ativo = event.target
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

      <div className="filter-actions">
        <button
          type="button"
          onClick={onSearch}
        >
          Buscar
        </button>

        <button
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