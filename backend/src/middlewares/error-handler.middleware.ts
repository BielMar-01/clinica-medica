import type { ErrorRequestHandler } from 'express'

import { AppError } from '../utils/app-error.js'

export const errorHandlerMiddleware: ErrorRequestHandler = (
  error,
  _req,
  res,
  _next,
) => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      status: 'error',
      message: error.message,
      code: error.code,
      details: error.details,
    })

    return
  }

  console.error('Erro não tratado:', error)

  res.status(500).json({
    status: 'error',
    message: 'Erro interno do servidor',
    code: 'INTERNAL_SERVER_ERROR',
  })
}