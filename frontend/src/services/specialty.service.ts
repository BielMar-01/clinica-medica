import type {
  SpecialtyFilters,
  SpecialtyFormData,
  SpecialtyListResponse,
  SpecialtyResponse,
} from '../types/specialty'

import {
  apiRequest,
} from './api'

function buildQuery(
  filters: SpecialtyFilters,
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

  if (filters.ativo) {
    params.set(
      'ativo',
      filters.ativo,
    )
  }

  return params.toString()
}

export async function listSpecialtiesRequest(
  filters: SpecialtyFilters,
) {
  const query =
    buildQuery(filters)

  return apiRequest<
    SpecialtyListResponse
  >(
    `/api/especialidades?${query}`,
    {
      method: 'GET',
    },
  )
}

export async function getSpecialtyRequest(
  specialtyId: string,
) {
  return apiRequest<
    SpecialtyResponse
  >(
    `/api/especialidades/${specialtyId}`,
    {
      method: 'GET',
    },
  )
}

export async function createSpecialtyRequest(
  data: SpecialtyFormData,
) {
  return apiRequest<
    SpecialtyResponse
  >(
    '/api/especialidades',
    {
      method: 'POST',

      body:
        JSON.stringify(data),
    },
  )
}

export async function updateSpecialtyRequest(
  specialtyId: string,
  data: SpecialtyFormData,
) {
  return apiRequest<
    SpecialtyResponse
  >(
    `/api/especialidades/${specialtyId}`,
    {
      method: 'PUT',

      body:
        JSON.stringify(data),
    },
  )
}

export async function updateSpecialtyStatusRequest(
  specialtyId: string,
  ativo: boolean,
) {
  return apiRequest<
    SpecialtyResponse
  >(
    `/api/especialidades/${specialtyId}/status`,
    {
      method: 'PATCH',

      body:
        JSON.stringify({
          ativo,
        }),
    },
  )
}