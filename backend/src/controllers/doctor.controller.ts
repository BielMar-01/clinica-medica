import type {
  Request,
  Response,
} from 'express'

import {
  changeDoctorStatus,
  editDoctor,
  getDoctorById,
  getDoctors,
  registerDoctor,
} from '../services/doctor.service.js'

import {
  createDoctorSchema,
  doctorIdSchema,
  doctorListQuerySchema,
  updateDoctorSchema,
  updateDoctorStatusSchema,
} from '../schemas/doctor.schema.js'

import {
  AppError,
} from '../utils/app-error.js'

function getAuthenticatedUserId(
  req: Request,
) {
  const userId =
    req.user?.id

  if (!userId) {
    throw new AppError(
      'Usuário não autenticado',
      401,
      'UNAUTHORIZED',
    )
  }

  return BigInt(
    userId,
  )
}

export async function listDoctorsController(
  req: Request,
  res: Response,
) {
  const query =
    doctorListQuerySchema.parse(
      req.query,
    )

  const result =
    await getDoctors(
      query,
    )

  return res
    .status(200)
    .json(result)
}

export async function getDoctorController(
  req: Request,
  res: Response,
) {
  const params =
    doctorIdSchema.parse(
      req.params,
    )

  const doctor =
    await getDoctorById(
      BigInt(params.id),
    )

  return res
    .status(200)
    .json({
      data: doctor,
    })
}

export async function createDoctorController(
  req: Request,
  res: Response,
) {
  const authenticatedUserId =
    getAuthenticatedUserId(
      req,
    )

  const body =
    createDoctorSchema.parse(
      req.body,
    )

  const doctor =
    await registerDoctor(
      body,
      authenticatedUserId,
    )

  return res
    .status(201)
    .json({
      status: 'ok',
      message:
        'Médico cadastrado com sucesso.',
      data: doctor,
    })
}

export async function updateDoctorController(
  req: Request,
  res: Response,
) {
  const authenticatedUserId =
    getAuthenticatedUserId(
      req,
    )

  const params =
    doctorIdSchema.parse(
      req.params,
    )

  const body =
    updateDoctorSchema.parse(
      req.body,
    )

  const doctor =
    await editDoctor(
      BigInt(params.id),
      body,
      authenticatedUserId,
    )

  return res
    .status(200)
    .json({
      status: 'ok',
      message:
        'Médico atualizado com sucesso.',
      data: doctor,
    })
}

export async function updateDoctorStatusController(
  req: Request,
  res: Response,
) {
  const authenticatedUserId =
    getAuthenticatedUserId(
      req,
    )

  const params =
    doctorIdSchema.parse(
      req.params,
    )

  const body =
    updateDoctorStatusSchema.parse(
      req.body,
    )

  const doctor =
    await changeDoctorStatus(
      BigInt(params.id),
      body.ativo,
      authenticatedUserId,
    )

  return res
    .status(200)
    .json({
      status: 'ok',
      message:
        body.ativo
          ? 'Médico ativado com sucesso.'
          : 'Médico inativado com sucesso.',
      data: doctor,
    })
}