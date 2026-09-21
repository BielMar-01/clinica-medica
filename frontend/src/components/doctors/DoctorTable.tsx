import type {
  DoctorSummary,
} from '../../types/doctor'

type DoctorTableProps = {
  doctors: DoctorSummary[]

  loading: boolean

  canManage: boolean

  onEdit: (
    doctor: DoctorSummary,
  ) => void

  onToggleStatus: (
    doctor: DoctorSummary,
  ) => void
}

function getMainSpecialty(
  doctor: DoctorSummary,
) {
  return doctor.especialidades.find(
    (specialty) =>
      specialty.principal,
  )
}

function getOtherSpecialties(
  doctor: DoctorSummary,
) {
  return doctor.especialidades.filter(
    (specialty) =>
      !specialty.principal,
  )
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
    return 'MD'
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

export function DoctorTable({
  doctors,
  loading,
  canManage,
  onEdit,
  onToggleStatus,
}: DoctorTableProps) {
  if (loading) {
    return (
      <div
        className="content-card"
        data-testid="doctors-loading"
      >
        Carregando médicos...
      </div>
    )
  }

  if (
    doctors.length === 0
  ) {
    return (
      <div
        className="content-card"
        data-testid="doctors-empty-message"
      >
        Nenhum médico encontrado.
      </div>
    )
  }

  return (
    <div
      className="table-card patient-table-card"
      data-testid="doctors-table-card"
    >
      <div
        className="table-wrapper patient-table-wrapper"
        data-testid="doctors-table-wrapper"
      >
        <table
          className="patient-table"
          data-testid="doctors-table"
        >
          <thead
            data-testid="doctors-table-header"
          >
            <tr>
              <th>Nome</th>

              <th>CRM</th>

              <th>
                Especialidade principal
              </th>

              <th>
                Outras especialidades
              </th>

              <th>
                Duração
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
            data-testid="doctors-table-body"
          >
            {doctors.map(
              (doctor) => {
                const mainSpecialty =
                  getMainSpecialty(
                    doctor,
                  )

                const otherSpecialties =
                  getOtherSpecialties(
                    doctor,
                  )

                return (
                  <tr
                    key={
                      doctor.id
                    }
                    data-testid={`doctors-row-${doctor.id}`}
                  >
                    <td
                      data-label="Médico"
                      data-testid={`doctors-name-${doctor.id}`}
                    >
                      <div className="table-primary-cell">
                        <div
                          className="table-avatar"
                          aria-hidden="true"
                        >
                          {getInitials(
                            doctor.nomeCompleto,
                          )}
                        </div>

                        <strong>
                          {
                            doctor.nomeCompleto
                          }
                        </strong>
                      </div>
                    </td>

                    <td
                      data-label="CRM"
                      data-testid={`doctors-crm-${doctor.id}`}
                    >
                      <strong>
                        {
                          doctor.crmNumero
                        }
                      </strong>

                      {' / '}

                      {
                        doctor.crmUf
                      }
                    </td>

                    <td
                      data-label="Especialidade principal"
                      data-testid={`doctors-main-specialty-${doctor.id}`}
                    >
                      {mainSpecialty ? (
                        mainSpecialty.nome
                      ) : (
                        <span className="table-muted-value">
                          Não informada
                        </span>
                      )}
                    </td>

                    <td
                      data-label="Outras especialidades"
                      data-testid={`doctors-other-specialties-${doctor.id}`}
                    >
                      {otherSpecialties.length >
                      0 ? (
                        otherSpecialties
                          .map(
                            (
                              specialty,
                            ) =>
                              specialty.nome,
                          )
                          .join(', ')
                      ) : (
                        <span className="table-muted-value">
                          Nenhuma
                        </span>
                      )}
                    </td>

                    <td
                      data-label="Duração"
                      data-testid={`doctors-duration-${doctor.id}`}
                    >
                      {
                        doctor
                          .duracaoConsultaMinutos
                      }{' '}
                      min
                    </td>

                    <td
                      data-label="Status"
                    >
                      <span
                        className={
                          doctor.ativo
                            ? 'status-badge active'
                            : 'status-badge inactive'
                        }
                        data-testid={`doctors-status-${doctor.id}`}
                      >
                        {doctor.ativo
                          ? 'Ativo'
                          : 'Inativo'}
                      </span>
                    </td>

                    <td
                      data-label="Ações"
                    >
                      <div
                        className="table-actions"
                        data-testid={`doctors-actions-${doctor.id}`}
                      >
                        {canManage ? (
                          <>
                            <button
                              type="button"
                              className="small-button"
                              onClick={() =>
                                onEdit(
                                  doctor,
                                )
                              }
                              data-testid={`doctors-edit-button-${doctor.id}`}
                            >
                              Editar
                            </button>

                            <button
                              type="button"
                              className="small-button secondary-button"
                              onClick={() =>
                                onToggleStatus(
                                  doctor,
                                )
                              }
                              data-testid={`doctors-status-button-${doctor.id}`}
                            >
                              {doctor.ativo
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
                )
              },
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}