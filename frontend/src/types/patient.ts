export type Patient = {
  id: string
  nomeCompleto: string
  cpf: string
  dataNascimento: string
  sexo: string | null
  telefone: string
  telefoneSecundario: string | null
  email: string | null
  nomeMae: string | null
  cep: string | null
  logradouro: string | null
  numero: string | null
  complemento: string | null
  bairro: string | null
  cidade: string | null
  estado: string | null
  observacoes: string | null
  ativo: boolean
  criadoEm: string
  criadoPor: string | null
  atualizadoEm: string | null
  atualizadoPor: string | null
}

export type PatientSummary = {
  id: string
  nomeCompleto: string
  cpf: string
  dataNascimento: string
  telefone: string
  email: string | null
  ativo: boolean
}

export type PatientFormData = {
  nomeCompleto: string
  cpf: string
  dataNascimento: string
  sexo: string
  telefone: string
  telefoneSecundario: string
  email: string
  nomeMae: string
  cep: string
  logradouro: string
  numero: string
  complemento: string
  bairro: string
  cidade: string
  estado: string
  observacoes: string
}

export type PatientListResponse = {
  status: 'ok'
  data: PatientSummary[]

  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export type PatientResponse = {
  status: 'ok'
  message?: string
  data: Patient
}

export type PatientFilters = {
  page: number
  limit: number
  nome: string
  cpf: string
  telefone: string
  ativo: '' | 'true' | 'false'
}