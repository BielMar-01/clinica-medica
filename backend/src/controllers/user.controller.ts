import type {
  Request,
  Response,
} from 'express'

import {
  updateUserSchema,
  updateUserStatusSchema,
  userIdSchema,
  userListQuerySchema,
} from '../schemas/user.schema.js'

import {
  changeUserStatus,
  editUser,
  getUserById,
  getUsers,
} from '../services/user.service.js'

import {
  AppError,
} from '../utils/app-error.js'

export async function listUsersController(
  req: Request,
  res: Response,
) {
  const parsedQuery =
    userListQuerySchema.safeParse(
      req.query,
    )

  if (
    !parsedQuery.success
  ) {
    throw new AppError(
      'Filtros da listagem de usuários inválidos',
      400,
      'USER_LIST_QUERY_INVALID',
      parsedQuery.error.flatten()
        .fieldErrors,
    )
  }

  const result =
    await getUsers(
      parsedQuery.data,
    )

  res.status(200).json({
    status: 'ok',

    data:
      result.data,

    pagination:
      result.pagination,
  })
}

export async function getUserController(
  req: Request,
  res: Response,
) {
  const parsedParams =
    userIdSchema.safeParse(
      req.params,
    )

  if (
    !parsedParams.success
  ) {
    throw new AppError(
      'ID do usuário inválido',
      400,
      'USER_ID_INVALID',
      parsedParams.error.flatten()
        .fieldErrors,
    )
  }

  const user =
    await getUserById(
      BigInt(
        parsedParams.data.id,
      ),
    )

  res.status(200).json({
    status: 'ok',

    data:
      user,
  })
}

export async function updateUserController(
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
    userIdSchema.safeParse(
      req.params,
    )

  if (
    !parsedParams.success
  ) {
    throw new AppError(
      'ID do usuário inválido',
      400,
      'USER_ID_INVALID',
      parsedParams.error.flatten()
        .fieldErrors,
    )
  }

  const parsedBody =
    updateUserSchema.safeParse(
      req.body,
    )

  if (
    !parsedBody.success
  ) {
    throw new AppError(
      'Dados do usuário inválidos',
      400,
      'USER_VALIDATION_ERROR',
      parsedBody.error.flatten()
        .fieldErrors,
    )
  }

  const user =
    await editUser(
      BigInt(
        parsedParams.data.id,
      ),

      parsedBody.data,

      req.user.id,
    )

  res.status(200).json({
    status: 'ok',

    message:
      'Usuário atualizado com sucesso',

    data:
      user,
  })
}

export async function updateUserStatusController(
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
    userIdSchema.safeParse(
      req.params,
    )

  if (
    !parsedParams.success
  ) {
    throw new AppError(
      'ID do usuário inválido',
      400,
      'USER_ID_INVALID',
      parsedParams.error.flatten()
        .fieldErrors,
    )
  }

  const parsedBody =
    updateUserStatusSchema.safeParse(
      req.body,
    )

  if (
    !parsedBody.success
  ) {
    throw new AppError(
      'Status do usuário inválido',
      400,
      'USER_STATUS_INVALID',
      parsedBody.error.flatten()
        .fieldErrors,
    )
  }

  const user =
    await changeUserStatus(
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
        ? 'Usuário ativado com sucesso'
        : 'Usuário inativado com sucesso',

    data:
      user,
  })
}