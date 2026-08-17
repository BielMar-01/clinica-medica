import type {
  PatientFilters,
  PatientFormData,
  PatientListResponse,
  PatientResponse,
} from '../types/patient'

import {
  apiRequest,
} from './api'

function buildQuery(
  filters: PatientFilters,
) {
  const params =
    new URLSearchParams()

  params.set(
    'page',
    filters.page.toString(),
  )

  params.set(
    'limit',
    filters.limit.toString(),
  )

  if (filters.nome) {
    params.set(
      'nome',
      filters.nome,
    )
  }

  if (filters.cpf) {
    params.set(
      'cpf',
      filters.cpf,
    )
  }

  if (filters.telefone) {
    params.set(
      'telefone',
      filters.telefone,
    )
  }

  if (filters.ativo) {
    params.set(
      'ativo',
      filters.ativo,
    )
  }

  return params.toString()
}

export async function listPatientsRequest(
  filters: PatientFilters,
) {
  const query =
    buildQuery(filters)

  return apiRequest<
    PatientListResponse
  >(
    `/api/pacientes?${query}`,
    {
      method: 'GET',
    },
  )
}

export async function getPatientRequest(
  patientId: string,
) {
  return apiRequest<
    PatientResponse
  >(
    `/api/pacientes/${patientId}`,
    {
      method: 'GET',
    },
  )
}

export async function createPatientRequest(
  data: PatientFormData,
) {
  return apiRequest<
    PatientResponse
  >(
    '/api/pacientes',
    {
      method: 'POST',

      body:
        JSON.stringify(
          data,
        ),
    },
  )
}

export async function updatePatientRequest(
  patientId: string,
  data: PatientFormData,
) {
  return apiRequest<
    PatientResponse
  >(
    `/api/pacientes/${patientId}`,
    {
      method: 'PUT',

      body:
        JSON.stringify(
          data,
        ),
    },
  )
}

export async function updatePatientStatusRequest(
  patientId: string,
  ativo: boolean,
) {
  return apiRequest<
    PatientResponse
  >(
    `/api/pacientes/${patientId}/status`,
    {
      method: 'PATCH',

      body:
        JSON.stringify({
          ativo,
        }),
    },
  )
}