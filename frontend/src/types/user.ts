import type {
  UserRole,
} from './auth'

export type SystemUser = {
  id: string
  nome: string
  email: string
  perfil: UserRole
  ativo: boolean
  ultimoLoginEm: string | null
  criadoEm: string
  criadoPor: string | null
  atualizadoEm: string | null
  atualizadoPor: string | null
}

export type UserSummary = {
  id: string
  nome: string
  email: string
  perfil: UserRole
  ativo: boolean
  ultimoLoginEm: string | null
}

export type UserFormData = {
  nome: string
  email: string
  perfil: UserRole
}

export type UserFilters = {
  page: number
  limit: number
  nome: string
  email: string

  perfil:
    | ''
    | UserRole

  ativo:
    | ''
    | 'true'
    | 'false'
}

export type UserListResponse = {
  status: 'ok'

  data: UserSummary[]

  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export type UserResponse = {
  status: 'ok'
  message?: string
  data: SystemUser
}