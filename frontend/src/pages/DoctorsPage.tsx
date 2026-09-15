import {
  useEffect,
  useState,
} from 'react'

import {
  DoctorTable,
} from '../components/doctors/DoctorTable'

import {
  useAuth,
} from '../hooks/useAuth'

import {
  listDoctorsRequest,
} from '../services/doctor.service'

import type {
  DoctorFilters,
  DoctorSummary,
} from '../types/doctor'

const initialFilters:
  DoctorFilters = {
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

  const canManage =
    user?.perfil === 'ADMIN'

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
            initialFilters,
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
  ])

  function handleEdit(
    doctor: DoctorSummary,
  ) {
    setError(
      `A edição do médico "${doctor.nomeCompleto}" será implementada na próxima etapa.`,
    )
  }

  function handleToggleStatus(
    doctor: DoctorSummary,
  ) {
    setError(
      `A alteração de status do médico "${doctor.nomeCompleto}" será implementada na próxima etapa.`,
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
            title="Cadastro será disponibilizado na próxima etapa"
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
          </div>
        )}
    </section>
  )
}