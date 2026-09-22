import type {
  PublicDoctorListResponse,
} from '../types/public-doctor'

import {
  apiRequest,
} from './api'

export async function listPublicDoctorsRequest() {
  return apiRequest<
    PublicDoctorListResponse
  >(
    '/api/public/medicos',
    {
      method: 'GET',

      retryOnUnauthorized:
        false,
    },
  )
}