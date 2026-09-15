import type {
  DoctorFilters,
  DoctorFormData,
  DoctorListResponse,
  DoctorResponse,
} from '../types/doctor'

import {
  apiRequest,
} from './api'

function buildQuery(
  filters: DoctorFilters,
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

  if (filters.crm) {
    params.set(
      'crm',
      filters.crm,
    )
  }

  if (filters.crmUf) {
    params.set(
      'crmUf',
      filters.crmUf,
    )
  }

  if (filters.especialidadeId) {
    params.set(
      'especialidadeId',
      filters.especialidadeId,
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

export async function listDoctorsRequest(
  filters: DoctorFilters,
) {
  const query =
    buildQuery(
      filters,
    )

  return apiRequest<
    DoctorListResponse
  >(
    `/api/medicos?${query}`,
    {
      method: 'GET',
    },
  )
}

export async function getDoctorRequest(
  doctorId: string,
) {
  return apiRequest<
    DoctorResponse
  >(
    `/api/medicos/${doctorId}`,
    {
      method: 'GET',
    },
  )
}

export async function createDoctorRequest(
  data: DoctorFormData,
) {
  return apiRequest<
    DoctorResponse
  >(
    '/api/medicos',
    {
      method: 'POST',

      body:
        JSON.stringify(
          data,
        ),
    },
  )
}

export async function updateDoctorRequest(
  doctorId: string,
  data: DoctorFormData,
) {
  return apiRequest<
    DoctorResponse
  >(
    `/api/medicos/${doctorId}`,
    {
      method: 'PUT',

      body:
        JSON.stringify(
          data,
        ),
    },
  )
}

export async function updateDoctorStatusRequest(
  doctorId: string,
  ativo: boolean,
) {
  return apiRequest<
    DoctorResponse
  >(
    `/api/medicos/${doctorId}/status`,
    {
      method: 'PATCH',

      body:
        JSON.stringify({
          ativo,
        }),
    },
  )
}