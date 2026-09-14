import {
  useEffect,
  useState,
} from 'react'

import {
  Navigate,
} from 'react-router'

import {
  UserForm,
} from '../components/users/UserForm'

import {
  useAuth,
} from '../hooks/useAuth'

import {
  createUserRequest,
  listUsersRequest,
} from '../services/user.service'

import type {
  UserFilters,
  UserFormData,
  UserSummary,
} from '../types/user'

const initialFilters:
  UserFilters = {
    page: 1,
    limit: 10,
    nome: '',
    email: '',
    perfil: '',
    ativo: '',
  }

function formatRole(
  role: UserSummary['perfil'],
) {
  switch (role) {
    case 'ADMIN':
      return 'Administrador'

    case 'RECEPCIONISTA':
      return 'Recepcionista'

    case 'MEDICO':
      return 'Médico'

    default:
      return role
  }
}

function formatLastLogin(
  value: string | null,
) {
  if (!value) {
    return 'Nunca acessou'
  }

  return new Intl.DateTimeFormat(
    'pt-BR',
    {
      dateStyle: 'short',
      timeStyle: 'short',
    },
  ).format(
    new Date(value),
  )
}

export function UsersPage() {
  const {
    user,
    isLoading:
      authLoading,
  } = useAuth()

  const [
    users,
    setUsers,
  ] =
    useState<
      UserSummary[]
    >([])

  const [
    filters,
    setFilters,
  ] =
    useState<
      UserFilters
    >(
      initialFilters,
    )

  const [
    appliedFilters,
    setAppliedFilters,
  ] =
    useState<
      UserFilters
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
    successMessage,
    setSuccessMessage,
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
    submitting,
    setSubmitting,
  ] =
    useState(false)

  const [
    reloadKey,
    setReloadKey,
  ] =
    useState(0)

  useEffect(() => {
    if (
      !user ||
      user.perfil !==
        'ADMIN'
    ) {
      return
    }

    let cancelled =
      false

    async function loadUsers() {
      try {
        const response =
          await listUsersRequest(
            appliedFilters,
          )

        if (cancelled) {
          return
        }

        setUsers(
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
            : 'Erro ao carregar usuários',
        )
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadUsers()

    return () => {
      cancelled = true
    }
  }, [
    user,
    appliedFilters,
    reloadKey,
  ])

  if (authLoading) {
    return (
      <section
        className="page"
        data-testid="users-loading-page"
      >
        <div
          className="content-card"
          data-testid="users-auth-loading"
        >
          Carregando...
        </div>
      </section>
    )
  }

  if (
    !user ||
    user.perfil !==
      'ADMIN'
  ) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    )
  }

  function handleSearch() {
    const nextFilters = {
      ...filters,
      page: 1,
    }

    setSuccessMessage('')

    setFilters(
      nextFilters,
    )

    setAppliedFilters(
      nextFilters,
    )

    setLoading(true)
  }

  function handleClear() {
    setSuccessMessage('')

    setFilters(
      initialFilters,
    )

    setAppliedFilters(
      initialFilters,
    )

    setLoading(true)
  }

  function openCreateForm() {
    setError('')
    setSuccessMessage('')

    setFormKey(
      (current) =>
        current + 1,
    )

    setFormOpen(true)
  }

  async function handleCreateUser(
    data: UserFormData,
  ) {
    try {
      setSubmitting(true)
      setError('')
      setSuccessMessage('')

      const response =
        await createUserRequest(
          data,
        )

      setFormOpen(false)

      setSuccessMessage(
        response.message ??
          'Usuário cadastrado com sucesso.',
      )

      const firstPageFilters = {
        ...appliedFilters,
        page: 1,
      }

      setFilters(
        (current) => ({
          ...current,
          page: 1,
        }),
      )

      if (
        appliedFilters.page ===
        1
      ) {
        setLoading(true)

        setReloadKey(
          (current) =>
            current + 1,
        )
      } else {
        setLoading(true)

        setAppliedFilters(
          firstPageFilters,
        )
      }
    } finally {
      setSubmitting(false)
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

  return (
    <section
      className="page"
      data-testid="users-page"
    >
      <header
        className="page-header"
        data-testid="users-page-header"
      >
        <div>
          <h1
            data-testid="users-page-title"
          >
            Usuários
          </h1>

          <p
            data-testid="users-page-description"
          >
            Gerencie os usuários que possuem
            acesso ao sistema.
          </p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={
            openCreateForm
          }
          data-testid="users-new-button"
        >
          Novo usuário
        </button>
      </header>

      {successMessage && (
        <div
          className="content-card"
          role="status"
          data-testid="users-success-message"
        >
          {successMessage}
        </div>
      )}

      {error && (
        <div
          className="page-error"
          role="alert"
          data-testid="users-error-message"
        >
          {error}
        </div>
      )}

      <div
        className="patient-filters"
        data-testid="users-filters"
      >
        <div
          className="filter-group"
        >
          <label>
            Nome

            <input
              type="text"
              value={
                filters.nome
              }
              onChange={(
                event,
              ) =>
                setFilters(
                  (current) => ({
                    ...current,

                    nome:
                      event
                        .target
                        .value,
                  }),
                )
              }
              placeholder="Buscar por nome"
              data-testid="users-name-filter"
            />
          </label>

          <label>
            E-mail

            <input
              type="text"
              value={
                filters.email
              }
              onChange={(
                event,
              ) =>
                setFilters(
                  (current) => ({
                    ...current,

                    email:
                      event
                        .target
                        .value,
                  }),
                )
              }
              placeholder="Buscar por e-mail"
              data-testid="users-email-filter"
            />
          </label>

          <label>
            Perfil

            <select
              value={
                filters.perfil
              }
              onChange={(
                event,
              ) =>
                setFilters(
                  (current) => ({
                    ...current,

                    perfil:
                      event
                        .target
                        .value as
                        UserFilters['perfil'],
                  }),
                )
              }
              data-testid="users-role-filter"
            >
              <option value="">
                Todos
              </option>

              <option value="ADMIN">
                Administrador
              </option>

              <option value="RECEPCIONISTA">
                Recepcionista
              </option>

              <option value="MEDICO">
                Médico
              </option>
            </select>
          </label>

          <label>
            Status

            <select
              value={
                filters.ativo
              }
              onChange={(
                event,
              ) =>
                setFilters(
                  (current) => ({
                    ...current,

                    ativo:
                      event
                        .target
                        .value as
                        UserFilters['ativo'],
                  }),
                )
              }
              data-testid="users-status-filter"
            >
              <option value="">
                Todos
              </option>

              <option value="true">
                Ativos
              </option>

              <option value="false">
                Inativos
              </option>
            </select>
          </label>
        </div>

        <div
          className="filter-actions"
        >
          <button
            type="button"
            onClick={
              handleSearch
            }
            data-testid="users-search-button"
          >
            Filtrar
          </button>

          <button
            type="button"
            className="secondary-button"
            onClick={
              handleClear
            }
            data-testid="users-clear-filters-button"
          >
            Limpar
          </button>
        </div>
      </div>

      <div
        className="table-card"
        data-testid="users-table-card"
      >
        <div
          className="table-wrapper"
        >
          <table
            className="patient-table"
            data-testid="users-table"
          >
            <thead>
              <tr>
                <th>
                  Nome
                </th>

                <th>
                  E-mail
                </th>

                <th>
                  Perfil
                </th>

                <th>
                  Último acesso
                </th>

                <th>
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td
                    colSpan={5}
                    data-testid="users-loading"
                  >
                    Carregando usuários...
                  </td>
                </tr>
              )}

              {!loading &&
                users.length ===
                  0 && (
                  <tr>
                    <td
                      colSpan={5}
                      data-testid="users-empty-message"
                    >
                      Nenhum usuário encontrado.
                    </td>
                  </tr>
                )}

              {!loading &&
                users.map(
                  (
                    systemUser,
                  ) => (
                    <tr
                      key={
                        systemUser.id
                      }
                      data-testid={`users-row-${systemUser.id}`}
                    >
                      <td
                        data-testid={`users-name-${systemUser.id}`}
                      >
                        {
                          systemUser.nome
                        }
                      </td>

                      <td
                        data-testid={`users-email-${systemUser.id}`}
                      >
                        {
                          systemUser.email
                        }
                      </td>

                      <td
                        data-testid={`users-role-${systemUser.id}`}
                      >
                        {formatRole(
                          systemUser.perfil,
                        )}
                      </td>

                      <td
                        data-testid={`users-last-login-${systemUser.id}`}
                      >
                        {formatLastLogin(
                          systemUser.ultimoLoginEm,
                        )}
                      </td>

                      <td>
                        <span
                          className={`status-badge ${
                            systemUser.ativo
                              ? 'active'
                              : 'inactive'
                          }`}
                          data-testid={`users-status-${systemUser.id}`}
                        >
                          {systemUser.ativo
                            ? 'Ativo'
                            : 'Inativo'}
                        </span>
                      </td>
                    </tr>
                  ),
                )}
            </tbody>
          </table>
        </div>
      </div>

      {!loading &&
        pagination.totalPages >
          0 && (
          <div
            className="pagination"
            data-testid="users-pagination"
          >
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
              data-testid="users-previous-page-button"
            >
              Anterior
            </button>

            <span
              data-testid="users-pagination-info"
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
              usuário(s)
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
              data-testid="users-next-page-button"
            >
              Próxima
            </button>
          </div>
        )}

      <UserForm
        key={
          formKey
        }
        open={
          formOpen
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
          handleCreateUser
        }
      />
    </section>
  )
}