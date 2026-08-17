import type { Request, Response } from 'express'

import {
  checkDatabaseConnection,
  listEspecialidades,
} from '../services/database.service.js'

export async function getDatabaseHealth(_req: Request, res: Response) {
  try {
    const result = await checkDatabaseConnection()

    res.status(200).json(result)
  } catch (error) {
    console.error('Erro ao conectar com o banco:', error)

    res.status(500).json({
      status: 'error',
      database: 'disconnected',
    })
  }
}

export async function getEspecialidades(_req: Request, res: Response) {
  try {
    const especialidades = await listEspecialidades()

    res.status(200).json(especialidades)
  } catch (error) {
    console.error('Erro ao consultar especialidades:', error)

    res.status(500).json({
      status: 'error',
      message: 'Erro ao consultar especialidades',
    })
  }
}