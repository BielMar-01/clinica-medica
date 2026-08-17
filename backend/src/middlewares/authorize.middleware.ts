import type {
  NextFunction,
  Request,
  Response,
} from 'express'

type UserRole =
  | 'ADMIN'
  | 'RECEPCIONISTA'
  | 'MEDICO'

export function authorizeMiddleware(
  ...allowedRoles: UserRole[]
) {
  return (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    if (!req.user) {
      res.status(401).json({
        status: 'error',
        message: 'Usuário não autenticado',
      })

      return
    }

    if (
      !allowedRoles.includes(
        req.user.perfil,
      )
    ) {
      res.status(403).json({
        status: 'error',
        message:
          'Usuário sem permissão para acessar este recurso',
      })

      return
    }

    next()
  }
}