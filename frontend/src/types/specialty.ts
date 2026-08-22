export type Specialty = {
  id: string
  nome: string
  descricao: string | null
  ativo: boolean
  criadoEm: string
  criadoPor: string | null
  atualizadoEm: string | null
  atualizadoPor: string | null
}

export type SpecialtySummary = {
  id: string
  nome: string
  descricao: string | null
  ativo: boolean
}

export type SpecialtyFormData = {
  nome: string
  descricao: string
}

export type SpecialtyFilters = {
  page: number
  limit: number
  nome: string
  ativo: '' | 'true' | 'false'
}

export type SpecialtyListResponse = {
  status: 'ok'

  data: SpecialtySummary[]

  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export type SpecialtyResponse = {
  status: 'ok'
  message?: string
  data: Specialty
}