export type UserRole =
  | 'ADMIN'
  | 'RECEPCIONISTA'
  | 'MEDICO'

export type AuthUser = {
  id: string
  nome: string
  email: string
  perfil: UserRole
}

export type LoginRequest = {
  email: string
  senha: string
}

export type LoginResponse = {
  status: 'ok'
  accessToken: string
  user: AuthUser
}

export type RefreshResponse = {
  status: 'ok'
  accessToken: string
  user: AuthUser
}

export type MeResponse = {
  status: 'ok'
  user: AuthUser
}

export type ApiErrorResponse = {
  status: 'error'
  message: string
  code?: string
  details?: unknown
}