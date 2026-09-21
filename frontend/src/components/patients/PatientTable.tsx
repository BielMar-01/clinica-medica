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

function getInitials(
  name: string,
) {
  const names =
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean)

  if (names.length === 0) {
    return '?'
  }

  if (names.length === 1) {
    return names[0]
      .charAt(0)
      .toUpperCase()
  }

  return (
    names[0].charAt(0) +
    names[
      names.length - 1
    ].charAt(0)
  ).toUpperCase()
}

function EmptyIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />

      <circle
        cx="9"
        cy="7"
        r="4"
      />

      <path d="M19 8v6" />

      <path d="M22 11h-6" />
    </svg>
  )
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
        className="content-card page-loading"
        data-testid="patients-loading"
        role="status"
        aria-live="polite"
      >
        <span
          className="page-loading-spinner"
          aria-hidden="true"
        />

        Carregando pacientes...
      </div>
    )
  }

  if (patients.length === 0) {
    return (
      <div
        className="content-card page-empty-state"
        data-testid="patients-empty-state"
      >
        <div className="page-empty-state-icon">
          <EmptyIcon />
        </div>

        <h2>
          Nenhum paciente encontrado
        </h2>

        <p>
          Não encontramos pacientes para
          os filtros informados. Ajuste a
          pesquisa ou limpe os filtros
          para visualizar outros registros.
        </p>
      </div>
    )
  }

  return (
    <div
      className="table-card patient-table-card"
      data-testid="patients-table-card"
    >
      <div
        className="table-wrapper patient-table-wrapper"
        data-testid="patients-table-wrapper"
      >
        <table
          className="patient-table"
          data-testid="patients-table"
        >
          <thead
            data-testid="patients-table-header"
          >
            <tr>
              <th scope="col">
                Nome
              </th>

              <th scope="col">
                CPF
              </th>

              <th scope="col">
                Telefone
              </th>

              <th scope="col">
                E-mail
              </th>

              <th scope="col">
                Status
              </th>

              {canManage && (
                <th scope="col">
                  Ações
                </th>
              )}
            </tr>
          </thead>

          <tbody
            data-testid="patients-table-body"
          >
            {patients.map(
              (patient) => (
                <tr
                  key={patient.id}
                  data-testid={`patient-row-${patient.id}`}
                >
                  <td
                    data-label="Paciente"
                    data-testid={`patient-name-${patient.id}`}
                  >
                    <div className="table-primary-cell">
                      <span className="table-avatar">
                        {getInitials(
                          patient.nomeCompleto,
                        )}
                      </span>

                      <strong>
                        {
                          patient
                            .nomeCompleto
                        }
                      </strong>
                    </div>
                  </td>

                  <td
                    data-label="CPF"
                    data-testid={`patient-cpf-${patient.id}`}
                  >
                    {formatCpf(
                      patient.cpf,
                    )}
                  </td>

                  <td
                    data-label="Telefone"
                    data-testid={`patient-phone-${patient.id}`}
                  >
                    {formatPhone(
                      patient.telefone,
                    )}
                  </td>

                  <td
                    data-label="E-mail"
                    data-testid={`patient-email-${patient.id}`}
                  >
                    <span
                      className={
                        patient.email
                          ? undefined
                          : 'table-muted-value'
                      }
                    >
                      {patient.email ??
                        'Não informado'}
                    </span>
                  </td>

                  <td
                    data-label="Status"
                  >
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

                  {canManage && (
                    <td
                      data-label="Ações"
                    >
                      <div
                        className="table-actions"
                        data-testid={`patient-actions-${patient.id}`}
                      >
                        <button
                          data-testid={`patient-edit-button-${patient.id}`}
                          type="button"
                          className="small-button"
                          onClick={() =>
                            onEdit(
                              patient,
                            )
                          }
                          aria-label={`Editar ${patient.nomeCompleto}`}
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
                          aria-label={
                            patient.ativo
                              ? `Inativar ${patient.nomeCompleto}`
                              : `Ativar ${patient.nomeCompleto}`
                          }
                        >
                          {patient.ativo
                            ? 'Inativar'
                            : 'Ativar'}
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}