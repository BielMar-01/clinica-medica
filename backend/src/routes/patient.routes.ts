import { Router } from 'express'

import {
  createPatientController,
  getPatientController,
  listPatientsController,
  updatePatientController,
  updatePatientStatusController,
} from '../controllers/patient.controller.js'

import {
  authenticateMiddleware,
} from '../middlewares/authenticate.middleware.js'

import {
  authorizeMiddleware,
} from '../middlewares/authorize.middleware.js'

const patientRouter =
  Router()

patientRouter.use(
  authenticateMiddleware,
)

patientRouter.get(
  '/',

  authorizeMiddleware(
    'ADMIN',
    'RECEPCIONISTA',
    'MEDICO',
  ),

  listPatientsController,
)

patientRouter.get(
  '/:id',

  authorizeMiddleware(
    'ADMIN',
    'RECEPCIONISTA',
    'MEDICO',
  ),

  getPatientController,
)

patientRouter.post(
  '/',

  authorizeMiddleware(
    'ADMIN',
    'RECEPCIONISTA',
  ),

  createPatientController,
)

patientRouter.put(
  '/:id',

  authorizeMiddleware(
    'ADMIN',
    'RECEPCIONISTA',
  ),

  updatePatientController,
)

patientRouter.patch(
  '/:id/status',

  authorizeMiddleware(
    'ADMIN',
    'RECEPCIONISTA',
  ),

  updatePatientStatusController,
)

export default patientRouter