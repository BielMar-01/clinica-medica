import {
  useEffect,
  useState,
} from 'react'

import {
  DoctorFilters,
} from '../components/doctors/DoctorFilters'

import {
  DoctorTable,
} from '../components/doctors/DoctorTable'

import {
  useAuth,
} from '../hooks/useAuth'

import {
  listDoctorsRequest,
} from '../services/doctor.service'

import {
  listSpecialtiesRequest,
} from '../services/specialty.service'

import type {
  DoctorFilters as DoctorFiltersType,
  DoctorSummary,
} from '../types/doctor'

import type {
  SpecialtySummary,
} from '../types/specialty'

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
    error,
    setError,
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
  ])

  function handleSearch() {
    const nextFilters = {
      ...filters,
      page: 1,
    }

    setError('')
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

  function handleEdit(
    doctor: DoctorSummary,
  ) {
    setError(
      `A edição do médico "${doctor.nomeCompleto}" será implementada em uma próxima etapa.`,
    )
  }

  function handleToggleStatus(
    doctor: DoctorSummary,
  ) {
    setError(
      `A alteração de status do médico "${doctor.nomeCompleto}" será implementada em uma próxima etapa.`,
    )
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
            disabled
            data-testid="doctors-new-button"
            title="Cadastro será disponibilizado em uma próxima etapa"
          >
            Novo médico
          </button>
        )}
      </header>

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
        filters={
          filters
        }
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
        doctors={
          doctors
        }
        loading={
          loading
        }
        canManage={
          canManage
        }
        onEdit={
          handleEdit
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
              {
                pagination.page
              }{' '}
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
    </section>
  )
}