import type {
  PatientSummary,
} from '../../types/patient'

type PatientTableProps = {
  patients: PatientSummary[]

  loading: boolean

  canManage: boolean

  onEdit: (
    patient: PatientSummary,
  ) => void

  onToggleStatus: (
    patient: PatientSummary,
  ) => void
}

function formatCpf(
  cpf: string,
) {
  if (cpf.length !== 11) {
    return cpf
  }

  return cpf.replace(
    /^(\d{3})(\d{3})(\d{3})(\d{2})$/,
    '$1.$2.$3-$4',
  )
}

function formatPhone(
  phone: string,
) {
  if (
    phone.length === 11
  ) {
    return phone.replace(
      /^(\d{2})(\d{5})(\d{4})$/,
      '($1) $2-$3',
    )
  }

  if (
    phone.length === 10
  ) {
    return phone.replace(
      /^(\d{2})(\d{4})(\d{4})$/,
      '($1) $2-$3',
    )
  }

  return phone
}

export function PatientTable({
  patients,
  loading,
  canManage,
  onEdit,
  onToggleStatus,
}: PatientTableProps) {
  if (loading) {
    return (
      <div
        className="content-card"
        data-testid="patients-loading"
      >
        Carregando pacientes...
      </div>
    )
  }

  if (
    patients.length === 0
  ) {
    return (
      <div
        className="content-card"
        data-testid="patients-empty-state"
      >
        Nenhum paciente encontrado.
      </div>
    )
  }

  return (
    <div
      className="table-card"
      data-testid="patients-table-card"
    >
      <div
        className="table-wrapper"
        data-testid="patients-table-wrapper"
      >
        <table
          className="patient-table"
          data-testid="patients-table"
        >
          <thead data-testid="patients-table-header">
            <tr>
              <th>Nome</th>
              <th>CPF</th>
              <th>Telefone</th>
              <th>E-mail</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody data-testid="patients-table-body">
            {patients.map(
              (patient) => (
                <tr
                  key={patient.id}
                  data-testid={`patient-row-${patient.id}`}
                >
                  <td
                    data-testid={`patient-name-${patient.id}`}
                  >
                    {
                      patient.nomeCompleto
                    }
                  </td>

                  <td
                    data-testid={`patient-cpf-${patient.id}`}
                  >
                    {formatCpf(
                      patient.cpf,
                    )}
                  </td>

                  <td
                    data-testid={`patient-phone-${patient.id}`}
                  >
                    {formatPhone(
                      patient.telefone,
                    )}
                  </td>

                  <td
                    data-testid={`patient-email-${patient.id}`}
                  >
                    {patient.email ??
                      '-'}
                  </td>

                  <td>
                    <span
                      data-testid={`patient-status-${patient.id}`}
                      className={
                        patient.ativo
                          ? 'status-badge active'
                          : 'status-badge inactive'
                      }
                    >
                      {patient.ativo
                        ? 'Ativo'
                        : 'Inativo'}
                    </span>
                  </td>

                  <td>
                    <div
                      className="table-actions"
                      data-testid={`patient-actions-${patient.id}`}
                    >
                      {canManage && (
                        <>
                          <button
                            data-testid={`patient-edit-button-${patient.id}`}
                            type="button"
                            className="small-button"
                            onClick={() =>
                              onEdit(
                                patient,
                              )
                            }
                          >
                            Editar
                          </button>

                          <button
                            data-testid={`patient-status-button-${patient.id}`}
                            type="button"
                            className="small-button secondary-button"
                            onClick={() =>
                              onToggleStatus(
                                patient,
                              )
                            }
                          >
                            {patient.ativo
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