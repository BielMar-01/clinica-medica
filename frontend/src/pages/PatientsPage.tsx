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
  }

function patientToFormData(
  patient: Awaited<
    ReturnType<
      typeof getPatientRequest
    >
  >['data'],
): PatientFormData {
  return {
    nomeCompleto:
      patient.nomeCompleto,

    cpf:
      patient.cpf,

    dataNascimento:
      patient.dataNascimento,

    sexo:
      patient.sexo ?? '',

    telefone:
      patient.telefone,

    telefoneSecundario:
      patient.telefoneSecundario ??
      '',

    email:
      patient.email ?? '',

    nomeMae:
      patient.nomeMae ?? '',

    cep:
      patient.cep ?? '',

    logradouro:
      patient.logradouro ?? '',

    numero:
      patient.numero ?? '',

    complemento:
      patient.complemento ??
      '',

    bairro:
      patient.bairro ?? '',

    cidade:
      patient.cidade ?? '',

    estado:
      patient.estado ?? '',

    observacoes:
      patient.observacoes ??
      '',
  }
}

export function PatientsPage() {
  const {
    user,
    isAuthenticated,
  } = useAuth()

  const [
    patients,
    setPatients,
  ] =
    useState<
      PatientSummary[]
    >([])

  const [
    filters,
    setFilters,
  ] =
    useState<
      PatientFilters
    >(
      initialFilters,
    )

  const [
    appliedFilters,
    setAppliedFilters,
  ] =
    useState<
      PatientFilters
    >(
      initialFilters,
    )

  const [
    pagination,
    setPagination,
  ] =
    useState({
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    })

  const [
    loading,
    setLoading,
  ] =
    useState(true)

  const [
    error,
    setError,
  ] =
    useState('')

  const [
    formOpen,
    setFormOpen,
  ] =
    useState(false)

  const [
    formTitle,
    setFormTitle,
  ] =
    useState(
      'Novo paciente',
    )

  const [
    formData,
    setFormData,
  ] =
    useState<
      PatientFormData | null
    >(null)

  const [
    editingPatientId,
    setEditingPatientId,
  ] =
    useState<
      string | null
    >(null)

  const [
    submitting,
    setSubmitting,
  ] =
    useState(false)

  const canManage =
    user?.perfil === 'ADMIN' ||
    user?.perfil ===
      'RECEPCIONISTA'

  const loadPatients =
    useCallback(
      async () => {
        if (!isAuthenticated) {
          return
        }

        try {
          setLoading(true)
          setError('')

          const response =
            await listPatientsRequest(
              appliedFilters,
            )

          setPatients(
            response.data,
          )

          setPagination(
            response.pagination,
          )
        } catch (error) {
          setError(
            error instanceof Error
              ? error.message
              : 'Erro ao carregar pacientes',
          )
        } finally {
          setLoading(false)
        }
      },
      [
        isAuthenticated,
        appliedFilters,
      ],
    )

  useEffect(() => {
    void loadPatients()
  }, [loadPatients])

  function handleSearch() {
    const nextFilters = {
      ...filters,
      page: 1,
    }

    setFilters(
      nextFilters,
    )

    setAppliedFilters(
      nextFilters,
    )
  }

  function handleClear() {
    setFilters(
      initialFilters,
    )

    setAppliedFilters(
      initialFilters,
    )
  }

  function openCreateForm() {
    setEditingPatientId(
      null,
    )

    setFormData(null)

    setFormTitle(
      'Novo paciente',
    )

    setFormOpen(true)
  }

  async function openEditForm(
    patient: PatientSummary,
  ) {
    try {
      setError('')

      const response =
        await getPatientRequest(
          patient.id,
        )

      setEditingPatientId(
        patient.id,
      )

      setFormData(
        patientToFormData(
          response.data,
        ),
      )

      setFormTitle(
        'Editar paciente',
      )

      setFormOpen(true)
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Erro ao carregar paciente',
      )
    }
  }

  async function handleSubmit(
    data: PatientFormData,
  ) {
    try {
      setSubmitting(true)

      if (
        editingPatientId
      ) {
        await updatePatientRequest(
          editingPatientId,
          data,
        )
      } else {
        await createPatientRequest(
          data,
        )
      }

      setFormOpen(false)

      await loadPatients()
    } finally {
      setSubmitting(false)
    }
  }

  async function handleToggleStatus(
    patient: PatientSummary,
  ) {
    const action =
      patient.ativo
        ? 'inativar'
        : 'ativar'

    const confirmed =
      window.confirm(
        `Deseja ${action} o paciente ${patient.nomeCompleto}?`,
      )

    if (!confirmed) {
      return
    }

    try {
      setError('')

      await updatePatientStatusRequest(
        patient.id,
        !patient.ativo,
      )

      await loadPatients()
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Erro ao alterar status do paciente',
      )
    }
  }

  function changePage(
    page: number,
  ) {
    if (
      page < 1 ||
      page >
        pagination.totalPages
    ) {
      return
    }

    setFilters(
      (current) => ({
        ...current,
        page,
      }),
    )

    setAppliedFilters(
      (current) => ({
        ...current,
        page,
      }),
    )
  }

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <h1>
            Pacientes
          </h1>

          <p>
            Cadastro, consulta e
            gerenciamento de
            pacientes.
          </p>
        </div>

        {canManage && (
          <button
            type="button"
            className="primary-button"
            onClick={
              openCreateForm
            }
          >
            Novo paciente
          </button>
        )}
      </header>

      {error && (
        <div
          className="page-error"
          role="alert"
        >
          {error}
        </div>
      )}

      <PatientFiltersComponent
        filters={filters}
        onChange={
          setFilters
        }
        onSearch={
          handleSearch
        }
        onClear={
          handleClear
        }
      />

      <PatientTable
        patients={patients}
        loading={loading}
        canManage={canManage}
        onEdit={
          openEditForm
        }
        onToggleStatus={
          handleToggleStatus
        }
      />

      {!loading &&
        pagination.totalPages >
          0 && (
          <div className="pagination">
            <button
              type="button"
              className="secondary-button"
              disabled={
                pagination.page <=
                1
              }
              onClick={() =>
                changePage(
                  pagination.page -
                    1,
                )
              }
            >
              Anterior
            </button>

            <span>
              Página{' '}
              {pagination.page}{' '}
              de{' '}
              {
                pagination.totalPages
              }
              {' — '}
              {pagination.total}{' '}
              paciente(s)
            </span>

            <button
              type="button"
              className="secondary-button"
              disabled={
                pagination.page >=
                pagination.totalPages
              }
              onClick={() =>
                changePage(
                  pagination.page +
                    1,
                )
              }
            >
              Próxima
            </button>
          </div>
        )}

      <PatientForm
        open={formOpen}
        title={formTitle}
        initialData={
          formData
        }
        submitting={
          submitting
        }
        onClose={() =>
          setFormOpen(false)
        }
        onSubmit={
          handleSubmit
        }
      />
    </section>
  )
}