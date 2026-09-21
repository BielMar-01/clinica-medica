import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import {
  PatientFiltersComponent,
} from '../components/patients/PatientFilters'

import {
  PatientForm,
} from '../components/patients/PatientForm'

import {
  PatientTable,
} from '../components/patients/PatientTable'

import {
  useAuth,
} from '../hooks/useAuth'

import {
  createPatientRequest,
  getPatientRequest,
  listPatientsRequest,
  updatePatientRequest,
  updatePatientStatusRequest,
} from '../services/patient.service'

import type {
  PatientFilters,
  PatientFormData,
  PatientSummary,
} from '../types/patient'

const initialFilters:
  PatientFilters = {
    page: 1,
    limit: 10,
    nome: '',
    cpf: '',
    telefone: '',
    ativo: '',
    ordenarPor: 'nome',
    ordem: 'asc',
  }

function PlusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  )
}

export function PatientsPage() {
  const {
    user,
  } = useAuth()

  const [
    patients,
    setPatients,
  ] = useState<
    PatientSummary[]
  >([])

  const [
    filters,
    setFilters,
  ] = useState<
    PatientFilters
  >(
    initialFilters,
  )

  const [
    appliedFilters,
    setAppliedFilters,
  ] = useState<
    PatientFilters
  >(
    initialFilters,
  )

  const [
    total,
    setTotal,
  ] = useState(0)

  const [
    totalPages,
    setTotalPages,
  ] = useState(1)

  const [
    loading,
    setLoading,
  ] = useState(true)

  const [
    error,
    setError,
  ] = useState('')

  const [
    success,
    setSuccess,
  ] = useState('')

  const [
    formOpen,
    setFormOpen,
  ] = useState(false)

  const [
    formTitle,
    setFormTitle,
  ] = useState(
    'Novo paciente',
  )

  const [
    editingPatientId,
    setEditingPatientId,
  ] = useState<
    string | null
  >(null)

  const [
    formInitialData,
    setFormInitialData,
  ] = useState<
    PatientFormData | null
  >(null)

  const [
    submitting,
    setSubmitting,
  ] = useState(false)

  const canManage =
    user?.perfil === 'ADMIN' ||
    user?.perfil ===
      'RECEPCIONISTA'

  const loadPatients =
    useCallback(
      async (
        nextFilters:
          PatientFilters,
      ) => {
        setLoading(true)
        setError('')

        try {
          const response =
            await listPatientsRequest(
              nextFilters,
            )

          setPatients(
            response.data,
          )

          setTotal(
            response
              .pagination
              .total,
          )

          setTotalPages(
            Math.max(
              response
                .pagination
                .totalPages,
              1,
            ),
          )
        } catch (requestError) {
          setPatients([])
          setTotal(0)
          setTotalPages(1)

          setError(
            requestError instanceof Error
              ? requestError.message
              : 'Erro ao carregar pacientes.',
          )
        } finally {
          setLoading(false)
        }
      },
      [],
    )

  useEffect(
    () => {
      const timeoutId =
        window.setTimeout(
          () => {
            void loadPatients(
              appliedFilters,
            )
          },
          0,
        )

      return () => {
        window.clearTimeout(
          timeoutId,
        )
      }
    },
    [
      appliedFilters,
      loadPatients,
    ],
  )

  function handleApplyFilters(
    nextFilters:
      PatientFilters,
  ) {
    setSuccess('')

    setFilters(
      nextFilters,
    )

    setAppliedFilters(
      nextFilters,
    )
  }

  function handleClearFilters() {
    setSuccess('')

    setFilters(
      initialFilters,
    )

    setAppliedFilters(
      initialFilters,
    )
  }

  function handlePageChange(
    page: number,
  ) {
    const nextFilters = {
      ...appliedFilters,
      page,
    }

    setFilters(
      nextFilters,
    )

    setAppliedFilters(
      nextFilters,
    )
  }

  function openCreateForm() {
    setError('')
    setSuccess('')

    setEditingPatientId(
      null,
    )

    setFormTitle(
      'Novo paciente',
    )

    setFormInitialData(
      null,
    )

    setFormOpen(true)
  }

  async function openEditForm(
    patient:
      PatientSummary,
  ) {
    setError('')
    setSuccess('')

    try {
      const response =
        await getPatientRequest(
          patient.id,
        )

      const currentPatient =
        response.data

      setEditingPatientId(
        patient.id,
      )

      setFormTitle(
        'Editar paciente',
      )

      setFormInitialData({
        nomeCompleto:
          currentPatient
            .nomeCompleto,

        cpf:
          currentPatient.cpf,

        dataNascimento:
          currentPatient
            .dataNascimento,

        sexo:
          currentPatient
            .sexo ?? '',

        telefone:
          currentPatient
            .telefone,

        telefoneSecundario:
          currentPatient
            .telefoneSecundario ??
          '',

        email:
          currentPatient
            .email ?? '',

        nomeMae:
          currentPatient
            .nomeMae ?? '',

        cep:
          currentPatient
            .cep ?? '',

        logradouro:
          currentPatient
            .logradouro ?? '',

        numero:
          currentPatient
            .numero ?? '',

        complemento:
          currentPatient
            .complemento ?? '',

        bairro:
          currentPatient
            .bairro ?? '',

        cidade:
          currentPatient
            .cidade ?? '',

        estado:
          currentPatient
            .estado ?? '',

        observacoes:
          currentPatient
            .observacoes ?? '',
      })

      setFormOpen(true)
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Erro ao carregar paciente.',
      )
    }
  }

  function closeForm() {
    if (submitting) {
      return
    }

    setFormOpen(false)

    setEditingPatientId(
      null,
    )

    setFormInitialData(
      null,
    )
  }

  async function handleSubmitPatient(
    data:
      PatientFormData,
  ) {
    setSubmitting(true)
    setError('')
    setSuccess('')

    try {
      if (editingPatientId) {
        await updatePatientRequest(
          editingPatientId,
          data,
        )

        setSuccess(
          'Paciente atualizado com sucesso.',
        )
      } else {
        await createPatientRequest(
          data,
        )

        setSuccess(
          'Paciente cadastrado com sucesso.',
        )
      }

      setFormOpen(false)

      setEditingPatientId(
        null,
      )

      setFormInitialData(
        null,
      )

      await loadPatients(
        appliedFilters,
      )
    } finally {
      setSubmitting(false)
    }
  }

  async function handleToggleStatus(
    patient:
      PatientSummary,
  ) {
    setError('')
    setSuccess('')

    try {
      await updatePatientStatusRequest(
        patient.id,
        !patient.ativo,
      )

      setSuccess(
        patient.ativo
          ? 'Paciente inativado com sucesso.'
          : 'Paciente ativado com sucesso.',
      )

      await loadPatients(
        appliedFilters,
      )
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Erro ao alterar status do paciente.',
      )
    }
  }

  return (
    <section
      className="page patients-page"
      data-testid="patients-page"
    >
      <header
        className="page-header"
        data-testid="patients-header"
      >
        <div>
          <span className="page-eyebrow">
            Gestão clínica
          </span>

          <h1
            data-testid="patients-title"
          >
            Pacientes
          </h1>

          <p
            data-testid="patients-description"
          >
            Consulte, organize e mantenha
            atualizados os dados cadastrais
            dos pacientes da clínica.
          </p>
        </div>

        {canManage && (
          <button
            data-testid="patients-new-button"
            type="button"
            className="primary-button patients-new-button"
            onClick={
              openCreateForm
            }
          >
            <PlusIcon />

            Novo paciente
          </button>
        )}
      </header>

      {success && (
        <div
          className="page-feedback page-feedback-success"
          role="status"
          data-testid="patients-success-message"
        >
          {success}
        </div>
      )}

      {error && (
        <div
          className="page-feedback page-feedback-error"
          role="alert"
          data-testid="patients-error-message"
        >
          {error}
        </div>
      )}

      <PatientFiltersComponent
        filters={filters}
        onChange={
          setFilters
        }
        onApply={
          handleApplyFilters
        }
        onClear={
          handleClearFilters
        }
      />

      <div
        className="page-summary patients-summary"
        data-testid="patients-summary"
      >
        <div>
          <span className="page-summary-text">
            {loading ? (
              'Atualizando resultados...'
            ) : (
              <>
                <strong
                  data-testid="patients-total"
                >
                  {total.toLocaleString(
                    'pt-BR',
                  )}
                </strong>{' '}
                {total === 1
                  ? 'paciente encontrado'
                  : 'pacientes encontrados'}
              </>
            )}
          </span>
        </div>

        {!loading &&
          totalPages > 1 && (
            <span
              className="page-summary-text"
              data-testid="patients-page-summary"
            >
              Página{' '}
              <strong>
                {
                  appliedFilters
                    .page
                }
              </strong>{' '}
              de{' '}
              <strong>
                {totalPages}
              </strong>
            </span>
          )}
      </div>

      <PatientTable
        patients={patients}
        loading={loading}
        canManage={
          canManage
        }
        onEdit={
          openEditForm
        }
        onToggleStatus={
          handleToggleStatus
        }
      />

      {!loading &&
        totalPages > 1 && (
          <div
            className="pagination"
            data-testid="patients-pagination"
          >
            <button
              data-testid="patients-previous-page-button"
              type="button"
              className="secondary-button"
              disabled={
                appliedFilters
                  .page <= 1
              }
              onClick={() =>
                handlePageChange(
                  appliedFilters
                    .page - 1,
                )
              }
            >
              Anterior
            </button>

            <span
              data-testid="patients-pagination-info"
            >
              Página{' '}
              {
                appliedFilters
                  .page
              }{' '}
              de {totalPages}
            </span>

            <button
              data-testid="patients-next-page-button"
              type="button"
              className="secondary-button"
              disabled={
                appliedFilters
                  .page >=
                totalPages
              }
              onClick={() =>
                handlePageChange(
                  appliedFilters
                    .page + 1,
                )
              }
            >
              Próxima
            </button>
          </div>
        )}

      <PatientForm
        key={
          editingPatientId ??
          (formOpen
            ? 'new-patient'
            : 'closed')
        }
        open={formOpen}
        title={formTitle}
        initialData={
          formInitialData
        }
        submitting={
          submitting
        }
        onClose={
          closeForm
        }
        onSubmit={
          handleSubmitPatient
        }
      />
    </section>
  )
}