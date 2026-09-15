import {
  Router,
} from 'express'

import authRouter from './auth.routes.js'
import authorizationTestRouter from './authorization-test.routes.js'
import databaseRouter from './database.routes.js'
import docsRouter from './docs.routes.js'
import doctorRouter from './doctor.routes.js'
import healthRouter from './health.routes.js'
import patientRouter from './patient.routes.js'
import specialtyRouter from './specialty.routes.js'
import userRouter from './user.routes.js'

const router =
  Router()

router.use(
  docsRouter,
)

router.use(
  '/auth',
  authRouter,
)

router.use(
  healthRouter,
)

router.use(
  databaseRouter,
)

router.use(
  '/pacientes',
  patientRouter,
)

router.use(
  '/especialidades',
  specialtyRouter,
)

router.use(
  '/usuarios',
  userRouter,
)

router.use(
  '/medicos',
  doctorRouter,
)

router.use(
  authorizationTestRouter,
)

export default router