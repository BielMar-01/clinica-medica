import { Router } from 'express'

import {
  forgotPasswordController,
  loginController,
  logoutController,
  meController,
  refreshController,
  verifyResetCodeController,
} from '../controllers/auth.controller.js'
import { authenticateMiddleware } from '../middlewares/authenticate.middleware.js'

const authRouter = Router()

authRouter.post(
  '/login',
  loginController,
)

authRouter.post(
  '/refresh',
  refreshController,
)

authRouter.post(
  '/logout',
  logoutController,
)

authRouter.post(
  '/forgot-password',
  forgotPasswordController,
)

authRouter.post(
  '/verify-reset-code',
  verifyResetCodeController,
)

authRouter.get(
  '/me',
  authenticateMiddleware,
  meController,
)

export default authRouter