import {
  Router,
} from 'express'

import {
  createDoctorController,
  getDoctorController,
  listDoctorsController,
  updateDoctorController,
  updateDoctorStatusController,
} from '../controllers/doctor.controller.js'

import {
  authenticateMiddleware,
} from '../middlewares/authenticate.middleware.js'

import {
  authorizeMiddleware,
} from '../middlewares/authorize.middleware.js'

const doctorRouter =
  Router()

doctorRouter.use(
  authenticateMiddleware,
)

doctorRouter.get(
  '/',
  authorizeMiddleware(
    'ADMIN',
    'RECEPCIONISTA',
    'MEDICO',
  ),
  listDoctorsController,
)

doctorRouter.get(
  '/:id',
  authorizeMiddleware(
    'ADMIN',
    'RECEPCIONISTA',
    'MEDICO',
  ),
  getDoctorController,
)

doctorRouter.post(
  '/',
  authorizeMiddleware(
    'ADMIN',
  ),
  createDoctorController,
)

doctorRouter.put(
  '/:id',
  authorizeMiddleware(
    'ADMIN',
  ),
  updateDoctorController,
)

doctorRouter.patch(
  '/:id/status',
  authorizeMiddleware(
    'ADMIN',
  ),
  updateDoctorStatusController,
)

export default doctorRouter