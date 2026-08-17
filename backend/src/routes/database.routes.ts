import { Router } from 'express'

import {
  getDatabaseHealth,
  getEspecialidades,
} from '../controllers/database.controller.js'

const databaseRouter = Router()

databaseRouter.get('/database-health', getDatabaseHealth)

databaseRouter.get(
  '/database-test/especialidades',
  getEspecialidades,
)

export default databaseRouter