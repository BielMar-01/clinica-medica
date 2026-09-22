import type {
  SpecialtyListResponse,
} from '../types/specialty'

import {
  apiRequest,
} from './api'

export async function listPublicSpecialtiesRequest() {
  return apiRequest<
    SpecialtyListResponse
  >(
    '/api/public/especialidades',
    {
      method: 'GET',

      retryOnUnauthorized:
        false,
    },
  )
}