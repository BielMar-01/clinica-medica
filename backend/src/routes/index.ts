import { Router } from 'express'

import databaseRouter from './database.routes.js'
import healthRouter from './health.routes.js'

const router = Router()

router.use(healthRouter)
router.use(databaseRouter)

export default router