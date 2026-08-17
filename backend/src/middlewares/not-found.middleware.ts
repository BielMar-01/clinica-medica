import type { Request, Response } from 'express'

export function notFoundMiddleware(req: Request, res: Response) {
  res.status(404).json({
    status: 'error',
    message: 'Rota não encontrada',
    path: req.originalUrl,
  })
}