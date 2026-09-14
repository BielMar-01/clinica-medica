import {
  useEffect,
  useState,
} from 'react'

import {
  SpecialtyFiltersComponent,
} from '../components/specialties/SpecialtyFilters'

import {
  SpecialtyForm,
} from '../components/specialties/SpecialtyForm'

import {
  SpecialtyTable,
} from '../components/specialties/SpecialtyTable'

import {
  useAuth,
} from '../hooks/useAuth'

import {
  createSpecialtyRequest,
  getSpecialtyRequest,
  listSpecialtiesRequest,
  updateSpecialtyRequest,
  updateSpecialtyStatusRequest,
} from '../services/specialty.service'

import type {
  SpecialtyFilters,
  SpecialtyFormData,
  SpecialtySummary,
} from '../types/specialty'

const initialFilters:
  SpecialtyFilters = {
    page: 1,
    limit: 10,
    nome: '',
    ativo: '',
  }

function specialtyToFormData(
  specialty: Awaited<
    ReturnType<
      typeof getSpecialtyRequest
    >
  >['data'],
): SpecialtyFormData {
  return {
    nome:
      specialty.nome,

    descricao:
      specialty.descricao ??
      '',
  }
}

export function SpecialtiesPage() {
  const {
    user,
    isAuthenticated,
  } = useAuth()

  const [
    specialties,
    setSpecialties,
  ] =
    useState<
      SpecialtySummary[]
    >([])

  const [
    filters,
    setFilters,
  ] =
    useState<
      SpecialtyFilters
    >(
      initialFilters,
    )

  const [
    appliedFilters,
    setAppliedFilters,
  ] =
    useState<
      SpecialtyFilters
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
    formKey,
    setFormKey,
  ] =
    useState(0)

  const [
    formTitle,
    setFormTitle,
  ] =
    useState(
      'Nova especialidade',
    )

  const [
    formData,
    setFormData,
  ] =
    useState<
      SpecialtyFormData | null
    >(null)

  const [
    editingSpecialtyId,
    setEditingSpecialtyId,
  ] =
    useState<
      string | null
    >(null)

  const [
    submitting,
    setSubmitting,
  ] =
    useState(false)

  const [
    reloadKey,
    setReloadKey,
  ] =
    useState(0)

  const canManage =
    user?.perfil ===
      'ADMIN'

  useEffect(() => {
    if (!isAuthenticated) {
      return
    }

    let cancelled =
      false

    async function loadSpecialties() {
      try {
        const response =
          await listSpecialtiesRequest(
            appliedFilters,
          )

        if (cancelled) {
          return
        }

        setSpecialties(
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
            : 'Erro ao carregar especialidades',
        )
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void loadSpecialties()

    return () => {
      cancelled = true
    }
  }, [
    isAuthenticated,
    appliedFilters,
    reloadKey,
  ])

  function handleSearch() {
    const nextFilters = {
      ...filters,
      page: 1,
    }

    setLoading(true)

    setFilters(
      nextFilters,
    )

    setAppliedFilters(
      nextFilters,
    )
  }

  function handleClear() {
    setLoading(true)

    setFilters(
      initialFilters,
    )

    setAppliedFilters(
      initialFilters,
    )
  }

  function openCreateForm() {
    setEditingSpecialtyId(
      null,
    )

    setFormData(null)

    setFormTitle(
      'Nova especialidade',
    )

    setFormKey(
      (current) =>
        current + 1,
    )

    setFormOpen(true)
  }

  async function openEditForm(
    specialty:
      SpecialtySummary,
  ) {
    try {
      setError('')

      const response =
        await getSpecialtyRequest(
          specialty.id,
        )

      setEditingSpecialtyId(
        specialty.id,
      )

      setFormData(
        specialtyToFormData(
          response.data,
        ),
      )

      setFormTitle(
        'Editar especialidade',
      )

      setFormKey(
        (current) =>
          current + 1,
      )

      setFormOpen(true)
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Erro ao carregar especialidade',
      )
    }
  }

  async function handleSubmit(
    data:
      SpecialtyFormData,
  ) {
    try {
      setSubmitting(true)

      if (
        editingSpecialtyId
      ) {
        await updateSpecialtyRequest(
          editingSpecialtyId,
          data,
        )
      } else {
        await createSpecialtyRequest(
          data,
        )
      }

      setFormOpen(false)

      setLoading(true)

      setReloadKey(
        (current) =>
          current + 1,
      )
    } finally {
      setSubmitting(false)
    }
  }

  async function handleToggleStatus(
    specialty:
      SpecialtySummary,
  ) {
    const action =
      specialty.ativo
        ? 'inativar'
        : 'ativar'

    const confirmed =
      window.confirm(
        `Deseja realmente ${action} a especialidade "${specialty.nome}"?`,
      )

    if (!confirmed) {
      return
    }

    try {
      setError('')

      await updateSpecialtyStatusRequest(
        specialty.id,
        !specialty.ativo,
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
          : `Erro ao ${action} especialidade`,
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

  return (
    <section
      className="page"
      data-testid="specialties-page"
    >
      <header
        className="page-header"
        data-testid="specialties-page-header"
      >
        <div>
          <h1
            data-testid="specialties-page-title"
          >
            Especialidades
          </h1>

          <p
            data-testid="specialties-page-description"
          >
            Cadastro e gerenciamento das
            especialidades médicas.
          </p>
        </div>

        {canManage && (
          <button
            data-testid="specialties-new-button"
            type="button"
            className="primary-button"
            onClick={
              openCreateForm
            }
          >
            Nova especialidade
          </button>
        )}
      </header>

      {error && (
        <div
          className="page-error"
          role="alert"
          data-testid="specialties-error-message"
        >
          {error}
        </div>
      )}

      <SpecialtyFiltersComponent
        filters={
          filters
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

      <SpecialtyTable
        specialties={
          specialties
        }
        loading={
          loading
        }
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
        pagination.totalPages >
          0 && (
          <div
            className="pagination"
            data-testid="specialties-pagination"
          >
            <button
              data-testid="specialties-previous-page-button"
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

            <span
              data-testid="specialties-pagination-info"
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
              especialidade(s)
            </span>

            <button
              data-testid="specialties-next-page-button"
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

      <SpecialtyForm
        key={
          formKey
        }
        open={
          formOpen
        }
        title={
          formTitle
        }
        initialData={
          formData
        }
        submitting={
          submitting
        }
        onClose={() =>
          setFormOpen(
            false,
          )
        }
        onSubmit={
          handleSubmit
        }
      />
    </section>
  )
}