import type {
  NextFunction,
  Request,
  Response,
} from 'express'

import { findUserById } from '../repositories/auth.repository.js'
import { verifyAccessToken } from '../utils/tokens.js'

export async function authenticateMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authorization =
    req.headers.authorization

  if (!authorization) {
    res.status(401).json({
      status: 'error',
      message: 'Token de acesso não informado',
    })

    return
  }

  const [type, token] =
    authorization.split(' ')

  if (
    type !== 'Bearer' ||
    !token
  ) {
    res.status(401).json({
      status: 'error',
      message: 'Formato do token inválido',
    })

    return
  }

  try {
    const payload =
      verifyAccessToken(token)

    const userId =
      BigInt(payload.sub)

    const user =
      await findUserById(userId)

    if (!user || !user.ativo) {
      res.status(401).json({
        status: 'error',
        message: 'Usuário inválido ou inativo',
      })

      return
    }

    if (
      user.perfil !== 'ADMIN' &&
      user.perfil !== 'RECEPCIONISTA' &&
      user.perfil !== 'MEDICO'
    ) {
      res.status(403).json({
        status: 'error',
        message: 'Perfil de usuário inválido',
      })

      return
    }

    req.user = {
      id: user.id,
      nome: user.nome,
      email: user.email,
      perfil: user.perfil,
    }

    next()
  } catch {
    res.status(401).json({
      status: 'error',
      message: 'Token inválido ou expirado',
    })
  }
}