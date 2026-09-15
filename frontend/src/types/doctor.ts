import type {
  SpecialtySummary,
} from './specialty'

export interface DoctorUser {
  id: string
  nome: string
  email: string
  perfil: 'MEDICO'
  ativo: boolean
}

export interface DoctorSpecialty {
  especialidadeId: string
  principal: boolean
  especialidade: SpecialtySummary
}

export interface DoctorSummary {
  id: string
  usuarioId: string
  nomeCompleto: string
  crmNumero: string
  crmUf: string
  telefone: string | null
  email: string | null
  duracaoConsultaMinutos: number
  ativo: boolean
  usuario: DoctorUser
  especialidades: DoctorSpecialty[]
}

export interface Doctor extends DoctorSummary {
  criadoEm: string
  criadoPor: string | null
  atualizadoEm: string | null
  atualizadoPor: string | null
}

export interface DoctorSpecialtyFormData {
  especialidadeId: string
  principal: boolean
}

export interface DoctorFormData {
  usuarioId: string
  nomeCompleto: string
  crmNumero: string
  crmUf: string
  telefone: string | null
  email: string | null
  duracaoConsultaMinutos: number
  especialidades: DoctorSpecialtyFormData[]
}

export interface DoctorFilters {
  page: number
  limit: number
  nome: string
  crm: string
  crmUf: string
  especialidadeId: string
  ativo: '' | 'true' | 'false'
}

export interface DoctorPagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface DoctorListResponse {
  status: 'ok'
  data: DoctorSummary[]
  pagination: DoctorPagination
}

export interface DoctorResponse {
  status: 'ok'
  message?: string
  data: Doctor
}