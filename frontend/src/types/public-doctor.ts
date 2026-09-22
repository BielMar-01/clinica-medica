export type PublicDoctorSpecialty = {
  id: string
  nome: string
  principal: boolean
}

export type PublicDoctor = {
  id: string
  nomeCompleto: string
  crmNumero: string
  crmUf: string
  especialidades: PublicDoctorSpecialty[]
}

export type PublicDoctorListResponse = {
  status: 'ok'

  data: PublicDoctor[]

  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}