import type {
  Request,
  Response,
} from 'express'

import {
  checkDatabaseConnection,
} from '../services/database.service.js'

export async function getDatabaseHealth(
  _req: Request,
  res: Response,
) {
  try {
    const result =
      await checkDatabaseConnection()

    res.status(200).json(
      result,
    )
  } catch (error) {
    console.error(
      'Erro ao conectar com o banco:',
      error,
    )

    res.status(500).json({
      status: 'error',
      database: 'disconnected',
    })
  }
}