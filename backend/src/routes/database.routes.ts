import { Router } from 'express'

import {
  getDatabaseHealth,
} from '../controllers/database.controller.js'

const databaseRouter = Router()

databaseRouter.get(
  '/database-health',
  getDatabaseHealth,
)

export default databaseRouter