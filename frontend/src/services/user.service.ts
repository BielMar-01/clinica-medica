import type {
  UserFilters,
  UserFormData,
  UserListResponse,
  UserResponse,
} from '../types/user'

import {
  apiRequest,
} from './api'

function buildQuery(
  filters: UserFilters,
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

  if (filters.email) {
    params.set(
      'email',
      filters.email,
    )
  }

  if (filters.perfil) {
    params.set(
      'perfil',
      filters.perfil,
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

export async function listUsersRequest(
  filters: UserFilters,
) {
  const query =
    buildQuery(
      filters,
    )

  return apiRequest<
    UserListResponse
  >(
    `/api/usuarios?${query}`,
    {
      method: 'GET',
    },
  )
}

export async function getUserRequest(
  userId: string,
) {
  return apiRequest<
    UserResponse
  >(
    `/api/usuarios/${userId}`,
    {
      method: 'GET',
    },
  )
}

export async function createUserRequest(
  data: UserFormData,
) {
  return apiRequest<
    UserResponse
  >(
    '/api/usuarios',
    {
      method: 'POST',

      body:
        JSON.stringify(
          data,
        ),
    },
  )
}

export async function updateUserRequest(
  userId: string,
  data: UserFormData,
) {
  return apiRequest<
    UserResponse
  >(
    `/api/usuarios/${userId}`,
    {
      method: 'PUT',

      body:
        JSON.stringify(
          data,
        ),
    },
  )
}

export async function updateUserStatusRequest(
  userId: string,
  ativo: boolean,
) {
  return apiRequest<
    UserResponse
  >(
    `/api/usuarios/${userId}/status`,
    {
      method: 'PATCH',

      body:
        JSON.stringify({
          ativo,
        }),
    },
  )
}