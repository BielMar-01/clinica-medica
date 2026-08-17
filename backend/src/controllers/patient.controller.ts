import type {
  Request,
  Response,
} from 'express'

import {
  createPatientSchema,
  patientIdSchema,
  patientListQuerySchema,
  updatePatientSchema,
  updatePatientStatusSchema,
} from '../schemas/patient.schema.js'

import {
  changePatientStatus,
  editPatient,
  getPatientById,
  getPatients,
  registerPatient,
} from '../services/patient.service.js'

import { AppError } from '../utils/app-error.js'

export async function listPatientsController(
  req: Request,
  res: Response,
) {
  const parsedQuery =
    patientListQuerySchema.safeParse(
      req.query,
    )

  if (
    !parsedQuery.success
  ) {
    throw new AppError(
      'Filtros da listagem de pacientes inválidos',
      400,
      'PATIENT_LIST_QUERY_INVALID',
      parsedQuery.error
        .flatten()
        .fieldErrors,
    )
  }

  const result =
    await getPatients(
      parsedQuery.data,
    )

  res.status(200).json({
    status: 'ok',
    data: result.data,
    pagination:
      result.pagination,
  })
}

export async function getPatientController(
  req: Request,
  res: Response,
) {
  const parsedParams =
    patientIdSchema.safeParse(
      req.params,
    )

  if (
    !parsedParams.success
  ) {
    throw new AppError(
      'ID do paciente inválido',
      400,
      'PATIENT_ID_INVALID',
      parsedParams.error
        .flatten()
        .fieldErrors,
    )
  }

  const patient =
    await getPatientById(
      BigInt(
        parsedParams.data.id,
      ),
    )

  res.status(200).json({
    status: 'ok',
    data: patient,
  })
}

export async function createPatientController(
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
    createPatientSchema.safeParse(
      req.body,
    )

  if (!parsedBody.success) {
    throw new AppError(
      'Dados do paciente inválidos',
      400,
      'PATIENT_VALIDATION_ERROR',
      parsedBody.error
        .flatten()
        .fieldErrors,
    )
  }

  const patient =
    await registerPatient(
      parsedBody.data,
      req.user.id,
    )

  res.status(201).json({
    status: 'ok',

    message:
      'Paciente cadastrado com sucesso',

    data:
      patient,
  })
}

export async function updatePatientController(
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
    patientIdSchema.safeParse(
      req.params,
    )

  if (
    !parsedParams.success
  ) {
    throw new AppError(
      'ID do paciente inválido',
      400,
      'PATIENT_ID_INVALID',
      parsedParams.error
        .flatten()
        .fieldErrors,
    )
  }

  const parsedBody =
    updatePatientSchema.safeParse(
      req.body,
    )

  if (
    !parsedBody.success
  ) {
    throw new AppError(
      'Dados do paciente inválidos',
      400,
      'PATIENT_VALIDATION_ERROR',
      parsedBody.error
        .flatten()
        .fieldErrors,
    )
  }

  const patient =
    await editPatient(
      BigInt(
        parsedParams.data.id,
      ),

      parsedBody.data,

      req.user.id,
    )

  res.status(200).json({
    status: 'ok',

    message:
      'Paciente atualizado com sucesso',

    data:
      patient,
  })
}

export async function updatePatientStatusController(
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
    patientIdSchema.safeParse(
      req.params,
    )

  if (
    !parsedParams.success
  ) {
    throw new AppError(
      'ID do paciente inválido',
      400,
      'PATIENT_ID_INVALID',
      parsedParams.error
        .flatten()
        .fieldErrors,
    )
  }

  const parsedBody =
    updatePatientStatusSchema.safeParse(
      req.body,
    )

  if (
    !parsedBody.success
  ) {
    throw new AppError(
      'Status do paciente inválido',
      400,
      'PATIENT_STATUS_INVALID',
      parsedBody.error
        .flatten()
        .fieldErrors,
    )
  }

  const patient =
    await changePatientStatus(
      BigInt(
        parsedParams.data.id,
      ),

      parsedBody.data.ativo,

      req.user.id,
    )

  res.status(200).json({
    status: 'ok',

    message:
      parsedBody.data.ativo
        ? 'Paciente ativado com sucesso'
        : 'Paciente inativado com sucesso',

    data:
      patient,
  })
}