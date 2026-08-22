import type {
  Request,
  Response,
} from 'express'

import {
  createSpecialtySchema,
  specialtyIdSchema,
  specialtyListQuerySchema,
  updateSpecialtySchema,
  updateSpecialtyStatusSchema,
} from '../schemas/specialty.schema.js'

import {
  changeSpecialtyStatus,
  editSpecialty,
  getSpecialties,
  getSpecialtyById,
  registerSpecialty,
} from '../services/specialty.service.js'

import { AppError } from '../utils/app-error.js'

export async function listSpecialtiesController(
  req: Request,
  res: Response,
) {
  const parsedQuery =
    specialtyListQuerySchema.safeParse(
      req.query,
    )

  if (!parsedQuery.success) {
    throw new AppError(
      'Filtros da listagem de especialidades inválidos',
      400,
      'SPECIALTY_LIST_QUERY_INVALID',
      parsedQuery.error.flatten().fieldErrors,
    )
  }

  const result =
    await getSpecialties(
      parsedQuery.data,
    )

  res.status(200).json({
    status: 'ok',
    data: result.data,
    pagination: result.pagination,
  })
}

export async function getSpecialtyController(
  req: Request,
  res: Response,
) {
  const parsedParams =
    specialtyIdSchema.safeParse(
      req.params,
    )

  if (!parsedParams.success) {
    throw new AppError(
      'ID da especialidade inválido',
      400,
      'SPECIALTY_ID_INVALID',
      parsedParams.error.flatten().fieldErrors,
    )
  }

  const specialty =
    await getSpecialtyById(
      BigInt(parsedParams.data.id),
    )

  res.status(200).json({
    status: 'ok',
    data: specialty,
  })
}

export async function createSpecialtyController(
  req: Request,
  res: Response,
) {
  if (!req.user) {
    throw new AppError(
      'Usuário não autenticado',
      401,
      'USER_NOT_AUTHENTICATED',
    )
  }

  const parsedBody =
    createSpecialtySchema.safeParse(
      req.body,
    )

  if (!parsedBody.success) {
    throw new AppError(
      'Dados da especialidade inválidos',
      400,
      'SPECIALTY_VALIDATION_ERROR',
      parsedBody.error.flatten().fieldErrors,
    )
  }

  const specialty =
    await registerSpecialty(
      parsedBody.data,
      req.user.id,
    )

  res.status(201).json({
    status: 'ok',
    message:
      'Especialidade cadastrada com sucesso',
    data: specialty,
  })
}

export async function updateSpecialtyController(
  req: Request,
  res: Response,
) {
  if (!req.user) {
    throw new AppError(
      'Usuário não autenticado',
      401,
      'USER_NOT_AUTHENTICATED',
    )
  }

  const parsedParams =
    specialtyIdSchema.safeParse(
      req.params,
    )

  if (!parsedParams.success) {
    throw new AppError(
      'ID da especialidade inválido',
      400,
      'SPECIALTY_ID_INVALID',
      parsedParams.error.flatten().fieldErrors,
    )
  }

  const parsedBody =
    updateSpecialtySchema.safeParse(
      req.body,
    )

  if (!parsedBody.success) {
    throw new AppError(
      'Dados da especialidade inválidos',
      400,
      'SPECIALTY_VALIDATION_ERROR',
      parsedBody.error.flatten().fieldErrors,
    )
  }

  const specialty =
    await editSpecialty(
      BigInt(parsedParams.data.id),
      parsedBody.data,
      req.user.id,
    )

  res.status(200).json({
    status: 'ok',
    message:
      'Especialidade atualizada com sucesso',
    data: specialty,
  })
}

export async function updateSpecialtyStatusController(
  req: Request,
  res: Response,
) {
  if (!req.user) {
    throw new AppError(
      'Usuário não autenticado',
      401,
      'USER_NOT_AUTHENTICATED',
    )
  }

  const parsedParams =
    specialtyIdSchema.safeParse(
      req.params,
    )

  if (!parsedParams.success) {
    throw new AppError(
      'ID da especialidade inválido',
      400,
      'SPECIALTY_ID_INVALID',
      parsedParams.error.flatten().fieldErrors,
    )
  }

  const parsedBody =
    updateSpecialtyStatusSchema.safeParse(
      req.body,
    )

  if (!parsedBody.success) {
    throw new AppError(
      'Status da especialidade inválido',
      400,
      'SPECIALTY_STATUS_INVALID',
      parsedBody.error.flatten().fieldErrors,
    )
  }

  const specialty =
    await changeSpecialtyStatus(
      BigInt(parsedParams.data.id),
      parsedBody.data.ativo,
      req.user.id,
    )

  res.status(200).json({
    status: 'ok',
    message: parsedBody.data.ativo
      ? 'Especialidade ativada com sucesso'
      : 'Especialidade inativada com sucesso',
    data: specialty,
  })
}