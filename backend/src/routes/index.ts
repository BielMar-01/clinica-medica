import { Router } from 'express'

import authRouter from './auth.routes.js'
import authorizationTestRouter from './authorization-test.routes.js'
import databaseRouter from './database.routes.js'
import docsRouter from './docs.routes.js'
import healthRouter from './health.routes.js'

const router = Router()

router.use(docsRouter)

router.use('/auth', authRouter)

router.use(healthRouter)

router.use(databaseRouter)

router.use(authorizationTestRouter)

export default router