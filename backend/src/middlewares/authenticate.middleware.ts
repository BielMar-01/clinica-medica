import type {
  NextFunction,
  Request,
  Response,
} from 'express'

import { findUserById } from '../repositories/auth.repository.js'
import { AppError } from '../utils/app-error.js'
import { verifyAccessToken } from '../utils/tokens.js'

export async function authenticateMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const authorization =
    req.headers.authorization

  if (!authorization) {
    throw new AppError(
      'Token de acesso não informado',
      401,
      'ACCESS_TOKEN_MISSING',
    )
  }

  const [type, token] =
    authorization.split(' ')

  if (
    type !== 'Bearer' ||
    !token
  ) {
    throw new AppError(
      'Formato do token inválido',
      401,
      'ACCESS_TOKEN_INVALID_FORMAT',
    )
  }

  try {
    const payload =
      verifyAccessToken(token)

    const userId =
      BigInt(payload.sub)

    const user =
      await findUserById(userId)

    if (!user || !user.ativo) {
      throw new AppError(
        'Usuário inválido ou inativo',
        401,
        'USER_INVALID',
      )
    }

    if (
      user.perfil !== 'ADMIN' &&
      user.perfil !== 'RECEPCIONISTA' &&
      user.perfil !== 'MEDICO'
    ) {
      throw new AppError(
        'Perfil de usuário inválido',
        403,
        'USER_ROLE_INVALID',
      )
    }

    req.user = {
      id: user.id,
      nome: user.nome,
      email: user.email,
      perfil: user.perfil,
    }

    next()
  } catch (error) {
    if (error instanceof AppError) {
      throw error
    }

    throw new AppError(
      'Token inválido ou expirado',
      401,
      'ACCESS_TOKEN_INVALID',
    )
  }
}