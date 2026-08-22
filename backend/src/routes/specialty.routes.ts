import { Router } from 'express'

import {
  createSpecialtyController,
  getSpecialtyController,
  listSpecialtiesController,
  updateSpecialtyController,
  updateSpecialtyStatusController,
} from '../controllers/specialty.controller.js'

import {
  authenticateMiddleware,
} from '../middlewares/authenticate.middleware.js'

import {
  authorizeMiddleware,
} from '../middlewares/authorize.middleware.js'

const specialtyRouter =
  Router()

specialtyRouter.use(
  authenticateMiddleware,
)

specialtyRouter.get(
  '/',
  authorizeMiddleware(
    'ADMIN',
    'RECEPCIONISTA',
    'MEDICO',
  ),
  listSpecialtiesController,
)

specialtyRouter.get(
  '/:id',
  authorizeMiddleware(
    'ADMIN',
    'RECEPCIONISTA',
    'MEDICO',
  ),
  getSpecialtyController,
)

specialtyRouter.post(
  '/',
  authorizeMiddleware(
    'ADMIN',
  ),
  createSpecialtyController,
)

specialtyRouter.put(
  '/:id',
  authorizeMiddleware(
    'ADMIN',
  ),
  updateSpecialtyController,
)

specialtyRouter.patch(
  '/:id/status',
  authorizeMiddleware(
    'ADMIN',
  ),
  updateSpecialtyStatusController,
)

export default specialtyRouter