import type {
  NextFunction,
  Request,
  Response,
} from 'express'

import { AppError } from '../utils/app-error.js'

type UserRole =
  | 'ADMIN'
  | 'RECEPCIONISTA'
  | 'MEDICO'

export function authorizeMiddleware(
  ...allowedRoles: UserRole[]
) {
  return (
    req: Request,
    _res: Response,
    next: NextFunction,
  ) => {
    if (!req.user) {
      throw new AppError(
        'Usuário não autenticado',
        401,
        'USER_NOT_AUTHENTICATED',
      )
    }

    if (
      !allowedRoles.includes(
        req.user.perfil,
      )
    ) {
      throw new AppError(
        'Usuário sem permissão para acessar este recurso',
        403,
        'FORBIDDEN',
      )
    }

    next()
  }
}