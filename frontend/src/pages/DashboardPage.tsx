import {
  useEffect,
  useState,
} from 'react'

import {
  Link,
} from 'react-router'

import {
  useAuth,
} from '../hooks/useAuth'

import {
  listDoctorsRequest,
} from '../services/doctor.service'

import {
  listPatientsRequest,
} from '../services/patient.service'

import {
  listSpecialtiesRequest,
} from '../services/specialty.service'

import {
  listUsersRequest,
} from '../services/user.service'

type DashboardTotals = {
  patients: number | null
  doctors: number | null
  specialties: number | null
  users: number | null
}

function PatientsIcon() {
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
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

function DoctorIcon() {
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
      <circle cx="12" cy="7" r="4" />
      <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
      <path d="M18 8h4" />
      <path d="M20 6v4" />
    </svg>
  )
}

function SpecialtyIcon() {
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
      <path d="M12 2v20" />
      <path d="M2 12h20" />
      <circle cx="12" cy="12" r="9" />
    </svg>
  )
}

function UsersIcon() {
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
      <circle cx="9" cy="7" r="4" />
      <path d="M2 21v-2a7 7 0 0 1 14 0v2" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      <path d="M22 21v-2a7 7 0 0 0-4-6.32" />
    </svg>
  )
}

function ArrowIcon() {
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
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  )
}

function getGreeting() {
  const hour =
    new Date().getHours()

  if (hour < 12) {
    return 'Bom dia'
  }

  if (hour < 18) {
    return 'Boa tarde'
  }

  return 'Boa noite'
}

function getRoleLabel(
  role?: string,
) {
  switch (role) {
    case 'ADMIN':
      return 'Administrador'

    case 'RECEPCIONISTA':
      return 'Recepcionista'

    case 'MEDICO':
      return 'Médico'

    default:
      return role ?? 'Usuário'
  }
}

export function DashboardPage() {
  const {
    user,
  } = useAuth()

  const [
    totals,
    setTotals,
  ] = useState<DashboardTotals>({
    patients: null,
    doctors: null,
    specialties: null,
    users: null,
  })

  const [
    loading,
    setLoading,
  ] = useState(true)

  const isAdmin =
    user?.perfil === 'ADMIN'

  useEffect(
    () => {
      let active = true

      async function loadDashboard() {
        setLoading(true)

        const [
          patientsResult,
          doctorsResult,
          specialtiesResult,
          usersResult,
        ] = await Promise.allSettled([
          listPatientsRequest({
            page: 1,
            limit: 1,
            nome: '',
            cpf: '',
            telefone: '',
            ativo: '',
            ordenarPor: 'nome',
            ordem: 'asc',
          }),

          listDoctorsRequest({
            page: 1,
            limit: 1,
            nome: '',
            crm: '',
            crmUf: '',
            especialidadeId: '',
            ativo: '',
          }),

          listSpecialtiesRequest({
            page: 1,
            limit: 1,
            nome: '',
            ativo: '',
          }),

          isAdmin
            ? listUsersRequest({
                page: 1,
                limit: 1,
                nome: '',
                email: '',
                perfil: '',
                ativo: '',
              })
            : Promise.resolve(null),
        ])

        if (!active) {
          return
        }

        setTotals({
          patients:
            patientsResult.status === 'fulfilled'
              ? patientsResult.value.pagination.total
              : null,

          doctors:
            doctorsResult.status === 'fulfilled'
              ? doctorsResult.value.pagination.total
              : null,

          specialties:
            specialtiesResult.status === 'fulfilled'
              ? specialtiesResult.value.pagination.total
              : null,

          users:
            isAdmin &&
            usersResult.status === 'fulfilled' &&
            usersResult.value
              ? usersResult.value.pagination.total
              : null,
        })

        setLoading(false)
      }

      void loadDashboard()

      return () => {
        active = false
      }
    },
    [
      isAdmin,
    ],
  )

  const firstName =
    user?.nome
      ?.trim()
      .split(/\s+/)[0] ??
    'usuário'

  function renderTotal(
    value: number | null,
  ) {
    if (loading) {
      return (
        <span
          className="dashboard-value-skeleton"
          aria-label="Carregando"
        />
      )
    }

    if (value === null) {
      return (
        <span className="dashboard-value-unavailable">
          Indisponível
        </span>
      )
    }

    return value.toLocaleString(
      'pt-BR',
    )
  }

  return (
    <section
      className="page dashboard-page"
      data-testid="dashboard-page"
    >
      <header
        className="page-header dashboard-header"
        data-testid="dashboard-header"
      >
        <div>
          <span className="dashboard-eyebrow">
            Visão geral
          </span>

          <h1
            data-testid="dashboard-title"
          >
            {getGreeting()},{' '}
            {firstName}.
          </h1>

          <p
            data-testid="dashboard-welcome-message"
          >
            Acompanhe os principais dados e
            acesse rapidamente os módulos da
            clínica.
          </p>
        </div>

        <div
          className="dashboard-session-indicator"
          data-testid="dashboard-session-card"
        >
          <span className="dashboard-session-dot" />

          <div>
            <small>
              Sessão
            </small>

            <strong
              data-testid="dashboard-session-status"
            >
              Ativa
            </strong>
          </div>
        </div>
      </header>

      <div
        className="dashboard-grid dashboard-summary-grid"
        data-testid="dashboard-cards"
      >
        <article
          className="dashboard-card dashboard-summary-card"
          data-testid="dashboard-patients-card"
        >
          <div className="dashboard-card-top">
            <div className="dashboard-card-icon">
              <PatientsIcon />
            </div>

            <span>
              Pacientes
            </span>
          </div>

          <strong
            className="dashboard-card-value"
            data-testid="dashboard-patients-status"
          >
            {renderTotal(
              totals.patients,
            )}
          </strong>

          <Link
            to="/pacientes"
            className="dashboard-card-link"
            data-testid="dashboard-patients-link"
          >
            Ver pacientes
            <ArrowIcon />
          </Link>
        </article>

        <article
          className="dashboard-card dashboard-summary-card"
          data-testid="dashboard-doctors-card"
        >
          <div className="dashboard-card-top">
            <div className="dashboard-card-icon">
              <DoctorIcon />
            </div>

            <span>
              Médicos
            </span>
          </div>

          <strong
            className="dashboard-card-value"
            data-testid="dashboard-doctors-total"
          >
            {renderTotal(
              totals.doctors,
            )}
          </strong>

          <Link
            to="/medicos"
            className="dashboard-card-link"
            data-testid="dashboard-doctors-link"
          >
            Ver médicos
            <ArrowIcon />
          </Link>
        </article>

        <article
          className="dashboard-card dashboard-summary-card"
          data-testid="dashboard-specialties-card"
        >
          <div className="dashboard-card-top">
            <div className="dashboard-card-icon">
              <SpecialtyIcon />
            </div>

            <span>
              Especialidades
            </span>
          </div>

          <strong
            className="dashboard-card-value"
            data-testid="dashboard-specialties-total"
          >
            {renderTotal(
              totals.specialties,
            )}
          </strong>

          <Link
            to="/especialidades"
            className="dashboard-card-link"
            data-testid="dashboard-specialties-link"
          >
            Ver especialidades
            <ArrowIcon />
          </Link>
        </article>

        {isAdmin && (
          <article
            className="dashboard-card dashboard-summary-card"
            data-testid="dashboard-users-card"
          >
            <div className="dashboard-card-top">
              <div className="dashboard-card-icon">
                <UsersIcon />
              </div>

              <span>
                Usuários
              </span>
            </div>

            <strong
              className="dashboard-card-value"
              data-testid="dashboard-users-total"
            >
              {renderTotal(
                totals.users,
              )}
            </strong>

            <Link
              to="/usuarios"
              className="dashboard-card-link"
              data-testid="dashboard-users-link"
            >
              Gerenciar usuários
              <ArrowIcon />
            </Link>
          </article>
        )}
      </div>

      <div className="dashboard-content-grid">
        <section
          className="content-card dashboard-quick-access"
          data-testid="dashboard-quick-access"
        >
          <div className="dashboard-section-header">
            <div>
              <span>
                Navegação
              </span>

              <h2>
                Acessos rápidos
              </h2>
            </div>

            <p>
              Atalhos para as principais
              operações do sistema.
            </p>
          </div>

          <div className="dashboard-quick-grid">
            <Link
              to="/pacientes"
              className="dashboard-quick-link"
              data-testid="dashboard-quick-patients-link"
            >
              <div className="dashboard-quick-icon">
                <PatientsIcon />
              </div>

              <div>
                <strong>
                  Pacientes
                </strong>

                <span>
                  Consulte e gerencie pacientes
                </span>
              </div>

              <ArrowIcon />
            </Link>

            <Link
              to="/medicos"
              className="dashboard-quick-link"
              data-testid="dashboard-quick-doctors-link"
            >
              <div className="dashboard-quick-icon">
                <DoctorIcon />
              </div>

              <div>
                <strong>
                  Médicos
                </strong>

                <span>
                  Consulte o corpo médico
                </span>
              </div>

              <ArrowIcon />
            </Link>

            <Link
              to="/especialidades"
              className="dashboard-quick-link"
              data-testid="dashboard-quick-specialties-link"
            >
              <div className="dashboard-quick-icon">
                <SpecialtyIcon />
              </div>

              <div>
                <strong>
                  Especialidades
                </strong>

                <span>
                  Consulte as especialidades
                </span>
              </div>

              <ArrowIcon />
            </Link>

            {isAdmin && (
              <Link
                to="/usuarios"
                className="dashboard-quick-link"
                data-testid="dashboard-quick-users-link"
              >
                <div className="dashboard-quick-icon">
                  <UsersIcon />
                </div>

                <div>
                  <strong>
                    Usuários
                  </strong>

                  <span>
                    Gerencie acessos da equipe
                  </span>
                </div>

                <ArrowIcon />
              </Link>
            )}
          </div>
        </section>

        <aside
          className="content-card dashboard-account-card"
          data-testid="dashboard-account-card"
        >
          <div className="dashboard-section-header">
            <div>
              <span>
                Sua conta
              </span>

              <h2>
                Ambiente atual
              </h2>
            </div>
          </div>

          <div className="dashboard-account-user">
            <div className="dashboard-account-avatar">
              {firstName
                .charAt(0)
                .toUpperCase()}
            </div>

            <div>
              <strong
                data-testid="dashboard-account-name"
              >
                {user?.nome}
              </strong>

              <span
                data-testid="dashboard-user-role"
              >
                {getRoleLabel(
                  user?.perfil,
                )}
              </span>
            </div>
          </div>

          <div className="dashboard-account-status">
            <div>
              <span>
                Status
              </span>

              <strong>
                <i />
                Sessão ativa
              </strong>
            </div>

            <div>
              <span>
                Perfil
              </span>

              <strong>
                {getRoleLabel(
                  user?.perfil,
                )}
              </strong>
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}