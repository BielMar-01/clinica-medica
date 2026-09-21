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

function getInitials(
  name: string,
) {
  const parts =
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean)

  if (parts.length === 0) {
    return 'ES'
  }

  if (parts.length === 1) {
    return parts[0]
      .slice(0, 2)
      .toUpperCase()
  }

  return (
    parts[0][0] +
    parts[parts.length - 1][0]
  ).toUpperCase()
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
      className="table-card patient-table-card"
      data-testid="specialties-table-card"
    >
      <div
        className="table-wrapper patient-table-wrapper"
        data-testid="specialties-table-wrapper"
      >
        <table
          className="patient-table"
          data-testid="specialties-table"
        >
          <thead
            data-testid="specialties-table-header"
          >
            <tr>
              <th>Nome</th>

              <th>
                Descrição
              </th>

              <th>
                Status
              </th>

              <th>
                Ações
              </th>
            </tr>
          </thead>

          <tbody
            data-testid="specialties-table-body"
          >
            {specialties.map(
              (specialty) => (
                <tr
                  key={
                    specialty.id
                  }
                  data-testid={`specialty-row-${specialty.id}`}
                >
                  <td
                    data-label="Especialidade"
                    data-testid={`specialty-name-${specialty.id}`}
                  >
                    <div className="table-primary-cell">
                      <div
                        className="table-avatar"
                        aria-hidden="true"
                      >
                        {getInitials(
                          specialty.nome,
                        )}
                      </div>

                      <strong>
                        {
                          specialty.nome
                        }
                      </strong>
                    </div>
                  </td>

                  <td
                    data-label="Descrição"
                    data-testid={`specialty-description-${specialty.id}`}
                  >
                    {specialty.descricao ? (
                      specialty.descricao
                    ) : (
                      <span className="table-muted-value">
                        Não informada
                      </span>
                    )}
                  </td>

                  <td
                    data-label="Status"
                  >
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

                  <td
                    data-label="Ações"
                  >
                    <div
                      className="table-actions"
                      data-testid={`specialty-actions-${specialty.id}`}
                    >
                      {canManage ? (
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
                      ) : (
                        <span className="table-muted-value">
                          Somente leitura
                        </span>
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