import type {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from 'express'

export const errorHandlerMiddleware: ErrorRequestHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.error('Erro não tratado:', error)

  res.status(500).json({
    status: 'error',
    message: 'Erro interno do servidor',
  })
}