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

function getSpecialtyName(
  specialty:
    DoctorSummary['especialidades'][number],
) {
  return specialty
    .especialidade
    ?.nome ??
    '-'
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

  if (doctors.length === 0) {
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
      className="table-card"
      data-testid="doctors-table-card"
    >
      <div
        className="table-wrapper"
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

                const otherSpecialtyNames =
                  otherSpecialties
                    .map(
                      (
                        specialty,
                      ) =>
                        getSpecialtyName(
                          specialty,
                        ),
                    )
                    .filter(
                      (name) =>
                        name !== '-',
                    )

                return (
                  <tr
                    key={doctor.id}
                    data-testid={`doctors-row-${doctor.id}`}
                  >
                    <td
                      data-testid={`doctors-name-${doctor.id}`}
                    >
                      {
                        doctor.nomeCompleto
                      }
                    </td>

                    <td
                      data-testid={`doctors-crm-${doctor.id}`}
                    >
                      {
                        doctor.crmNumero
                      }

                      {' / '}

                      {
                        doctor.crmUf
                      }
                    </td>

                    <td
                      data-testid={`doctors-main-specialty-${doctor.id}`}
                    >
                      {mainSpecialty
                        ? getSpecialtyName(
                            mainSpecialty,
                          )
                        : '-'}
                    </td>

                    <td
                      data-testid={`doctors-other-specialties-${doctor.id}`}
                    >
                      {otherSpecialtyNames
                        .length > 0
                        ? otherSpecialtyNames.join(
                            ', ',
                          )
                        : '-'}
                    </td>

                    <td
                      data-testid={`doctors-duration-${doctor.id}`}
                    >
                      {
                        doctor
                          .duracaoConsultaMinutos
                      }{' '}
                      min
                    </td>

                    <td>
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

                    <td>
                      <div
                        className="table-actions"
                        data-testid={`doctors-actions-${doctor.id}`}
                      >
                        {canManage && (
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