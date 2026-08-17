import type {
  Request,
  Response,
} from 'express'

export function adminOnlyController(
  req: Request,
  res: Response,
) {
  res.status(200).json({
    status: 'ok',
    message:
      'Usuário autorizado como administrador',

    user: {
      id: req.user?.id.toString(),
      perfil: req.user?.perfil,
    },
  })
}