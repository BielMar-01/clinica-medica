import {
  useEffect,
  useState,
} from 'react'

import {
  DoctorFilters,
} from '../components/doctors/DoctorFilters'

import {
  DoctorForm,
} from '../components/doctors/DoctorForm'

import {
  DoctorTable,
} from '../components/doctors/DoctorTable'

import {
  useAuth,
} from '../hooks/useAuth'

import {
  createDoctorRequest,
  getDoctorRequest,
  listDoctorsRequest,
  updateDoctorRequest,
  updateDoctorStatusRequest,
} from '../services/doctor.service'

import {
  listSpecialtiesRequest,
} from '../services/specialty.service'

import {
  listUsersRequest,
} from '../services/user.service'

import type {
  Doctor,
  DoctorFilters as DoctorFiltersType,
  DoctorFormData,
  DoctorSummary,
} from '../types/doctor'

import type {
  SpecialtySummary,
} from '../types/specialty'

import type {
  UserSummary,
} from '../types/user'

const initialFilters:
  DoctorFiltersType = {
    page: 1,
    limit: 10,
    nome: '',
    crm: '',
    crmUf: '',
    especialidadeId: '',
    ativo: '',
  }

type FormMode =
  | 'create'
  | 'edit'

function doctorToFormData(
  doctor: Doctor,
): DoctorFormData {
  return {
    usuarioId:
      doctor.usuarioId,

    nomeCompleto:
      doctor.nomeCompleto,

    crmNumero:
      doctor.crmNumero,

    crmUf:
      doctor.crmUf,

    telefone:
      doctor.telefone,

    email:
      doctor.email,

    duracaoConsultaMinutos:
      doctor
        .duracaoConsultaMinutos,

    especialidades:
      doctor.especialidades.map(
        (specialty) => ({
          especialidadeId:
            specialty.id,

          principal:
            specialty.principal,
        }),
      ),
  }
}

export function DoctorsPage() {
  const {
    user,
    isAuthenticated,
  } = useAuth()

  const [
    doctors,
    setDoctors,
  ] =
    useState<
      DoctorSummary[]
    >([])

  const [
    specialties,
    setSpecialties,
  ] =
    useState<
      SpecialtySummary[]
    >([])

  const [
    doctorUsers,
    setDoctorUsers,
  ] =
    useState<
      UserSummary[]
    >([])

  const [
    filters,
    setFilters,
  ] =
    useState<
      DoctorFiltersType
    >(
      initialFilters,
    )

  const [
    appliedFilters,
    setAppliedFilters,
  ] =
    useState<
      DoctorFiltersType
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
    specialtiesLoading,
    setSpecialtiesLoading,
  ] =
    useState(true)

  const [
    usersLoading,
    setUsersLoading,
  ] =
    useState(false)

  const [
    formOpen,
    setFormOpen,
  ] =
    useState(false)

  const [
    formMode,
    setFormMode,
  ] =
    useState<FormMode>(
      'create',
    )

  const [
    formInitialData,
    setFormInitialData,
  ] =
    useState<
      DoctorFormData | null
    >(null)

  const [
    editingDoctorId,
    setEditingDoctorId,
  ] =
    useState<
      string | null
    >(null)

  const [
    formKey,
    setFormKey,
  ] =
    useState(0)

  const [
    submitting,
    setSubmitting,
  ] =
    useState(false)

  const [
    statusUpdatingId,
    setStatusUpdatingId,
  ] =
    useState<
      string | null
    >(null)

  const [
    reloadKey,
    setReloadKey,
  ] =
    useState(0)

  const [
    error,
    setError,
  ] =
    useState('')

  const [
    successMessage,
    setSuccessMessage,
  ] =
    useState('')

  const canManage =
    user?.perfil === 'ADMIN'

  useEffect(() => {
    if (!isAuthenticated) {
      return
    }

    let cancelled =
      false

    async function loadSpecialties() {
      try {
        const response =
          await listSpecialtiesRequest({
            page: 1,
            limit: 100,
            nome: '',
            ativo: 'true',
          })

        if (cancelled) {
          return
        }

        setSpecialties(
          response.data,
        )
      } catch (error) {
        if (cancelled) {
          return
        }

        setError(
          error instanceof Error
            ? error.message
            : 'Erro ao carregar especialidades',
        )
      } finally {
        if (!cancelled) {
          setSpecialtiesLoading(
            false,
          )
        }
      }
    }

    void loadSpecialties()

    return () => {
      cancelled = true
    }
  }, [
    isAuthenticated,
  ])

  useEffect(() => {
    if (!isAuthenticated) {
      return
    }

    let cancelled =
      false

    async function loadDoctors() {
      try {
        const response =
          await listDoctorsRequest(
            appliedFilters,
          )

        if (cancelled) {
          return
        }

        setDoctors(
          response.data,
        )

        setPagination(
          response.pagination,
        )

        setError('')
      } catch (error) {
        if (cancelled) {
          return
        }

        setError(
          error instanceof Error
            ? error.message
            : 'Erro ao carregar médicos',
        )
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void loadDoctors()

    return () => {
      cancelled = true
    }
  }, [
    isAuthenticated,
    appliedFilters,
    reloadKey,
  ])

  async function loadDoctorUsers() {
    try {
      setUsersLoading(true)

      const response =
        await listUsersRequest({
          page: 1,
          limit: 100,
          nome: '',
          email: '',
          perfil: 'MEDICO',
          ativo: 'true',
        })

      setDoctorUsers(
        response.data,
      )

      return response.data
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Erro ao carregar usuários médicos',
      )

      throw error
    } finally {
      setUsersLoading(false)
    }
  }

  function handleSearch() {
    const nextFilters = {
      ...filters,
      page: 1,
    }

    setError('')
    setSuccessMessage('')
    setLoading(true)

    setFilters(
      nextFilters,
    )

    setAppliedFilters(
      nextFilters,
    )
  }

  function handleClear() {
    setError('')
    setSuccessMessage('')
    setLoading(true)

    setFilters(
      initialFilters,
    )

    setAppliedFilters(
      initialFilters,
    )
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

    setError('')
    setSuccessMessage('')
    setLoading(true)

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

  async function openCreateForm() {
    try {
      setError('')
      setSuccessMessage('')

      await loadDoctorUsers()

      setFormMode(
        'create',
      )

      setFormInitialData(
        null,
      )

      setEditingDoctorId(
        null,
      )

      setFormKey(
        (current) =>
          current + 1,
      )

      setFormOpen(true)
    } catch {
      setFormOpen(false)
    }
  }

  async function handleCreateDoctor(
    data: DoctorFormData,
  ) {
    try {
      setSubmitting(true)
      setError('')
      setSuccessMessage('')

      const response =
        await createDoctorRequest(
          data,
        )

      setFormOpen(false)

      setSuccessMessage(
        response.message ??
          'Médico cadastrado com sucesso.',
      )

      setLoading(true)

      setReloadKey(
        (current) =>
          current + 1,
      )
    } finally {
      setSubmitting(false)
    }
  }

  async function handleEdit(
    doctor: DoctorSummary,
  ) {
    try {
      setError('')
      setSuccessMessage('')
      setUsersLoading(true)

      const [
        doctorResponse,
        usersResponse,
      ] =
        await Promise.all([
          getDoctorRequest(
            doctor.id,
          ),

          listUsersRequest({
            page: 1,
            limit: 100,
            nome: '',
            email: '',
            perfil: 'MEDICO',
            ativo: 'true',
          }),
        ])

      const completeDoctor =
        doctorResponse.data

      const currentUser:
        UserSummary = {
          id:
            completeDoctor
              .usuario.id,

          nome:
            completeDoctor
              .usuario.nome,

          email:
            completeDoctor
              .usuario.email,

          perfil:
            completeDoctor
              .usuario.perfil,

          ativo:
            completeDoctor
              .usuario.ativo,

          ultimoLoginEm:
            null,
        }

      const availableUsers =
        usersResponse.data.some(
          (systemUser) =>
            systemUser.id ===
            currentUser.id,
        )
          ? usersResponse.data
          : [
              currentUser,
              ...usersResponse.data,
            ]

      setDoctorUsers(
        availableUsers,
      )

      setFormMode(
        'edit',
      )

      setEditingDoctorId(
        completeDoctor.id,
      )

      setFormInitialData(
        doctorToFormData(
          completeDoctor,
        ),
      )

      setFormKey(
        (current) =>
          current + 1,
      )

      setFormOpen(true)
    } catch (error) {
      setFormOpen(false)

      setError(
        error instanceof Error
          ? error.message
          : 'Erro ao carregar médico para edição',
      )
    } finally {
      setUsersLoading(false)
    }
  }

  async function handleUpdateDoctor(
    data: DoctorFormData,
  ) {
    if (!editingDoctorId) {
      throw new Error(
        'Médico não identificado para edição.',
      )
    }

    try {
      setSubmitting(true)
      setError('')
      setSuccessMessage('')

      const response =
        await updateDoctorRequest(
          editingDoctorId,
          data,
        )

      setFormOpen(false)

      setFormInitialData(
        null,
      )

      setEditingDoctorId(
        null,
      )

      setSuccessMessage(
        response.message ??
          'Médico atualizado com sucesso.',
      )

      setLoading(true)

      setReloadKey(
        (current) =>
          current + 1,
      )
    } finally {
      setSubmitting(false)
    }
  }

  async function handleFormSubmit(
    data: DoctorFormData,
  ) {
    if (
      formMode === 'edit'
    ) {
      await handleUpdateDoctor(
        data,
      )

      return
    }

    await handleCreateDoctor(
      data,
    )
  }

  function handleCloseForm() {
    if (submitting) {
      return
    }

    setFormOpen(false)

    setFormInitialData(
      null,
    )

    setEditingDoctorId(
      null,
    )

    setFormMode(
      'create',
    )
  }

  async function handleToggleStatus(
    doctor: DoctorSummary,
  ) {
    if (
      statusUpdatingId !== null
    ) {
      return
    }

    const nextStatus =
      !doctor.ativo

    const action =
      nextStatus
        ? 'ativar'
        : 'inativar'

    const confirmed =
      window.confirm(
        `Deseja realmente ${action} o médico "${doctor.nomeCompleto}"?`,
      )

    if (!confirmed) {
      return
    }

    try {
      setStatusUpdatingId(
        doctor.id,
      )

      setError('')
      setSuccessMessage('')

      const response =
        await updateDoctorStatusRequest(
          doctor.id,
          nextStatus,
        )

      setSuccessMessage(
        response.message ??
          (
            nextStatus
              ? 'Médico ativado com sucesso.'
              : 'Médico inativado com sucesso.'
          ),
      )

      setLoading(true)

      setReloadKey(
        (current) =>
          current + 1,
      )
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : nextStatus
            ? 'Erro ao ativar médico'
            : 'Erro ao inativar médico',
      )
    } finally {
      setStatusUpdatingId(
        null,
      )
    }
  }

  return (
    <section
      className="page"
      data-testid="doctors-page"
    >
      <header
        className="page-header"
        data-testid="doctors-page-header"
      >
        <div>
          <h1
            data-testid="doctors-page-title"
          >
            Médicos
          </h1>

          <p
            data-testid="doctors-page-description"
          >
            Cadastro e gerenciamento dos médicos da clínica.
          </p>
        </div>

        {canManage && (
          <button
            type="button"
            className="primary-button"
            onClick={() =>
              void openCreateForm()
            }
            data-testid="doctors-new-button"
          >
            Novo médico
          </button>
        )}
      </header>

      {successMessage && (
        <div
          className="content-card"
          role="status"
          data-testid="doctors-success-message"
        >
          {successMessage}
        </div>
      )}

      {error && (
        <div
          className="page-error"
          role="alert"
          data-testid="doctors-error-message"
        >
          {error}
        </div>
      )}

      <DoctorFilters
        filters={filters}
        specialties={
          specialties
        }
        specialtiesLoading={
          specialtiesLoading
        }
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

      <DoctorTable
        doctors={doctors}
        loading={loading}
        canManage={
          canManage
        }
        onEdit={(doctor) =>
          void handleEdit(
            doctor,
          )
        }
        onToggleStatus={(doctor) =>
          void handleToggleStatus(
            doctor,
          )
        }
      />

      {!loading &&
        pagination.totalPages >
          0 && (
          <div
            className="pagination"
            data-testid="doctors-pagination"
          >
            <button
              type="button"
              className="secondary-button"
              disabled={
                pagination.page <= 1
              }
              onClick={() =>
                changePage(
                  pagination.page -
                    1,
                )
              }
              data-testid="doctors-previous-page-button"
            >
              Anterior
            </button>

            <span
              data-testid="doctors-pagination-info"
            >
              Página{' '}
              {pagination.page}{' '}
              de{' '}
              {
                pagination.totalPages
              }
              {' — '}
              {
                pagination.total
              }{' '}
              médico(s)
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
              data-testid="doctors-next-page-button"
            >
              Próxima
            </button>
          </div>
        )}

      <DoctorForm
        key={formKey}
        open={formOpen}
        mode={formMode}
        initialData={
          formInitialData
        }
        users={doctorUsers}
        specialties={
          specialties
        }
        loadingUsers={
          usersLoading
        }
        submitting={
          submitting
        }
        onClose={
          handleCloseForm
        }
        onSubmit={
          handleFormSubmit
        }
      />
    </section>
  )
}