import { Router } from 'express'

import {
  adminOnlyController,
} from '../controllers/authorization-test.controller.js'
import {
  authenticateMiddleware,
} from '../middlewares/authenticate.middleware.js'
import {
  authorizeMiddleware,
} from '../middlewares/authorize.middleware.js'

const authorizationTestRouter =
  Router()

authorizationTestRouter.get(
  '/authorization-test/admin',
  authenticateMiddleware,
  authorizeMiddleware('ADMIN'),
  adminOnlyController,
)

export default authorizationTestRouter