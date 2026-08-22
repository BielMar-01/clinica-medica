import type {
  SpecialtySummary,
} from '../../types/specialty'

type SpecialtyTableProps = {
  specialties: SpecialtySummary[]

  loading: boolean

  canManage: boolean

  onEdit: (
    specialty: SpecialtySummary,
  ) => void

  onToggleStatus: (
    specialty: SpecialtySummary,
  ) => void
}

export function SpecialtyTable({
  specialties,
  loading,
  canManage,
  onEdit,
  onToggleStatus,
}: SpecialtyTableProps) {
  if (loading) {
    return (
      <div
        className="content-card"
        data-testid="specialties-loading"
      >
        Carregando especialidades...
      </div>
    )
  }

  if (
    specialties.length === 0
  ) {
    return (
      <div
        className="content-card"
        data-testid="specialties-empty-state"
      >
        Nenhuma especialidade encontrada.
      </div>
    )
  }

  return (
    <div
      className="table-card"
      data-testid="specialties-table-card"
    >
      <div
        className="table-wrapper"
        data-testid="specialties-table-wrapper"
      >
        <table
          className="patient-table"
          data-testid="specialties-table"
        >
          <thead data-testid="specialties-table-header">
            <tr>
              <th>Nome</th>
              <th>Descrição</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody data-testid="specialties-table-body">
            {specialties.map(
              (specialty) => (
                <tr
                  key={specialty.id}
                  data-testid={`specialty-row-${specialty.id}`}
                >
                  <td
                    data-testid={`specialty-name-${specialty.id}`}
                  >
                    {specialty.nome}
                  </td>

                  <td
                    data-testid={`specialty-description-${specialty.id}`}
                  >
                    {specialty.descricao ??
                      '-'}
                  </td>

                  <td>
                    <span
                      data-testid={`specialty-status-${specialty.id}`}
                      className={
                        specialty.ativo
                          ? 'status-badge active'
                          : 'status-badge inactive'
                      }
                    >
                      {specialty.ativo
                        ? 'Ativa'
                        : 'Inativa'}
                    </span>
                  </td>

                  <td>
                    <div
                      className="table-actions"
                      data-testid={`specialty-actions-${specialty.id}`}
                    >
                      {canManage && (
                        <>
                          <button
                            data-testid={`specialty-edit-button-${specialty.id}`}
                            type="button"
                            className="small-button"
                            onClick={() =>
                              onEdit(
                                specialty,
                              )
                            }
                          >
                            Editar
                          </button>

                          <button
                            data-testid={`specialty-status-button-${specialty.id}`}
                            type="button"
                            className="small-button secondary-button"
                            onClick={() =>
                              onToggleStatus(
                                specialty,
                              )
                            }
                          >
                            {specialty.ativo
                              ? 'Inativar'
                              : 'Ativar'}
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}