import type {
  PatientSummary,
} from '../../types/patient'

type PatientTableProps = {
  patients: PatientSummary[]

  loading: boolean

  canManage: boolean

  onEdit:
    (
      patient: PatientSummary,
    ) => void

  onToggleStatus:
    (
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
  if (phone.length === 11) {
    return phone.replace(
      /^(\d{2})(\d{5})(\d{4})$/,
      '($1) $2-$3',
    )
  }

  if (phone.length === 10) {
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
      <div className="content-card">
        Carregando pacientes...
      </div>
    )
  }

  if (patients.length === 0) {
    return (
      <div className="content-card">
        Nenhum paciente encontrado.
      </div>
    )
  }

  return (
    <div className="table-card">
      <div className="table-wrapper">
        <table className="patient-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>CPF</th>
              <th>Telefone</th>
              <th>E-mail</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {patients.map(
              (patient) => (
                <tr
                  key={patient.id}
                >
                  <td>
                    {
                      patient.nomeCompleto
                    }
                  </td>

                  <td>
                    {formatCpf(
                      patient.cpf,
                    )}
                  </td>

                  <td>
                    {formatPhone(
                      patient.telefone,
                    )}
                  </td>

                  <td>
                    {patient.email ??
                      '-'}
                  </td>

                  <td>
                    <span
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
                    <div className="table-actions">
                      {canManage && (
                        <>
                          <button
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